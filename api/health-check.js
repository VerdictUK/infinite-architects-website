/**
 * API HEALTH CHECK - Test AI Connections for Infinite Architects
 * Vercel Serverless Function
 *
 * Tests all configured AI APIs and reports their status before use.
 * Helps identify API credit exhaustion or configuration issues.
 */

// Configuration for all AI services
const API_CONFIGS = {
  claude: {
    name: 'Claude (Anthropic)',
    envKey: 'ANTHROPIC_API_KEY',
    endpoint: 'https://api.anthropic.com/v1/messages',
    testMethod: 'anthropic'
  },
  gpt: {
    name: 'GPT-4o (OpenAI)',
    envKey: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    testMethod: 'openai'
  },
  gemini: {
    name: 'Gemini (Google)',
    envKey: 'GEMINI_API_KEY',
    altEnvKey: 'GOOGLE_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
    testMethod: 'google'
  },
  perplexity: {
    name: 'Perplexity (Sonar)',
    envKey: 'PERPLEXITY_API_KEY',
    endpoint: 'https://api.perplexity.ai/chat/completions',
    testMethod: 'openai'
  },
  deepseek: {
    name: 'DeepSeek',
    envKey: 'DEEPSEEK_API_KEY',
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
    testMethod: 'openai'
  },
  grok: {
    name: 'Grok (xAI)',
    envKey: 'GROK_API_KEY',
    endpoint: 'https://api.x.ai/v1/chat/completions',
    testMethod: 'openai'
  },
  groq: {
    name: 'Groq (LPU)',
    envKey: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    testMethod: 'openai'
  },
  elevenlabs: {
    name: 'ElevenLabs (TTS)',
    envKey: 'ELEVENLABS_API_KEY',
    endpoint: 'https://api.elevenlabs.io/v1/user',
    testMethod: 'elevenlabs'
  }
};

/**
 * Test Anthropic API (Claude)
 */
async function testAnthropic(apiKey) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Hi' }]
    })
  });

  const data = await response.json();

  if (response.ok && data.content) {
    return { status: 'operational', message: 'Connection successful' };
  }

  if (response.status === 401) {
    return { status: 'error', message: 'Invalid API key' };
  }

  if (response.status === 429) {
    return { status: 'rate_limited', message: 'Rate limit reached or credits exhausted' };
  }

  if (data.error?.message?.includes('credit') || data.error?.message?.includes('balance')) {
    return { status: 'no_credits', message: 'API credits exhausted' };
  }

  return { status: 'error', message: data.error?.message || `HTTP ${response.status}` };
}

/**
 * Test OpenAI-compatible APIs (GPT, Perplexity, DeepSeek, Grok, Groq)
 */
async function testOpenAICompatible(endpoint, apiKey, model = 'gpt-4o') {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 5
    })
  });

  const data = await response.json();

  if (response.ok && data.choices) {
    return { status: 'operational', message: 'Connection successful' };
  }

  if (response.status === 401) {
    return { status: 'error', message: 'Invalid API key' };
  }

  if (response.status === 429) {
    return { status: 'rate_limited', message: 'Rate limit reached or credits exhausted' };
  }

  if (response.status === 402 || data.error?.code === 'insufficient_quota') {
    return { status: 'no_credits', message: 'API credits exhausted' };
  }

  return { status: 'error', message: data.error?.message || `HTTP ${response.status}` };
}

/**
 * Test Google Gemini API
 */
async function testGoogle(apiKey) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Hi' }] }],
        generationConfig: { maxOutputTokens: 5 }
      })
    }
  );

  const data = await response.json();

  if (response.ok && data.candidates) {
    return { status: 'operational', message: 'Connection successful' };
  }

  if (response.status === 401 || response.status === 403) {
    return { status: 'error', message: 'Invalid API key or insufficient permissions' };
  }

  if (response.status === 429) {
    return { status: 'rate_limited', message: 'Rate limit reached or quota exhausted' };
  }

  return { status: 'error', message: data.error?.message || `HTTP ${response.status}` };
}

/**
 * Test ElevenLabs API (TTS)
 */
async function testElevenLabs(apiKey) {
  const response = await fetch('https://api.elevenlabs.io/v1/user', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'xi-api-key': apiKey
    }
  });

  const data = await response.json();

  if (response.ok && data.subscription) {
    const remaining = data.subscription.character_limit - data.subscription.character_count;
    if (remaining <= 0) {
      return {
        status: 'no_credits',
        message: `Character limit reached (${data.subscription.character_count}/${data.subscription.character_limit})`
      };
    }
    return {
      status: 'operational',
      message: `${remaining.toLocaleString()} characters remaining`,
      details: {
        tier: data.subscription.tier,
        charactersUsed: data.subscription.character_count,
        characterLimit: data.subscription.character_limit,
        remaining: remaining
      }
    };
  }

  if (response.status === 401) {
    return { status: 'error', message: 'Invalid API key' };
  }

  return { status: 'error', message: data.detail?.message || `HTTP ${response.status}` };
}

/**
 * Test a single API service
 */
async function testService(serviceName, config) {
  // Check if API key is configured
  const apiKey = process.env[config.envKey] || (config.altEnvKey ? process.env[config.altEnvKey] : null);

  if (!apiKey) {
    return {
      service: serviceName,
      name: config.name,
      status: 'not_configured',
      message: `${config.envKey} not set in environment variables`
    };
  }

  try {
    let result;

    switch (config.testMethod) {
      case 'anthropic':
        result = await testAnthropic(apiKey);
        break;
      case 'openai':
        // Map service to correct model
        const modelMap = {
          gpt: 'gpt-4o',
          perplexity: 'llama-3.1-sonar-large-128k-online',
          deepseek: 'deepseek-chat',
          grok: 'grok-2-latest',
          groq: 'llama-3.3-70b-versatile'
        };
        result = await testOpenAICompatible(config.endpoint, apiKey, modelMap[serviceName]);
        break;
      case 'google':
        result = await testGoogle(apiKey);
        break;
      case 'elevenlabs':
        result = await testElevenLabs(apiKey);
        break;
      default:
        result = { status: 'error', message: 'Unknown test method' };
    }

    return {
      service: serviceName,
      name: config.name,
      ...result
    };
  } catch (error) {
    return {
      service: serviceName,
      name: config.name,
      status: 'error',
      message: error.message || 'Connection failed'
    };
  }
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const startTime = Date.now();

  try {
    // Parse which services to test (default: all)
    const { services } = req.query;
    const servicesToTest = services
      ? services.split(',').filter(s => API_CONFIGS[s])
      : Object.keys(API_CONFIGS);

    // Test all requested services in parallel
    const results = await Promise.all(
      servicesToTest.map(service => testService(service, API_CONFIGS[service]))
    );

    // Categorise results
    const operational = results.filter(r => r.status === 'operational');
    const notConfigured = results.filter(r => r.status === 'not_configured');
    const noCredits = results.filter(r => r.status === 'no_credits');
    const rateLimited = results.filter(r => r.status === 'rate_limited');
    const errors = results.filter(r => r.status === 'error');

    // Determine overall health
    let overallStatus = 'healthy';
    if (operational.length === 0) {
      overallStatus = 'unhealthy';
    } else if (noCredits.length > 0 || errors.length > 0) {
      overallStatus = 'degraded';
    }

    // Build response
    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      summary: {
        total: results.length,
        operational: operational.length,
        notConfigured: notConfigured.length,
        noCredits: noCredits.length,
        rateLimited: rateLimited.length,
        errors: errors.length
      },
      services: results,
      recommendations: []
    };

    // Add recommendations
    if (notConfigured.length > 0) {
      response.recommendations.push({
        type: 'info',
        message: `${notConfigured.length} service(s) not configured: ${notConfigured.map(r => r.name).join(', ')}`
      });
    }

    if (noCredits.length > 0) {
      response.recommendations.push({
        type: 'warning',
        message: `${noCredits.length} service(s) have exhausted credits: ${noCredits.map(r => r.name).join(', ')}`,
        action: 'Please add credits or upgrade your plan'
      });
    }

    if (errors.length > 0) {
      response.recommendations.push({
        type: 'error',
        message: `${errors.length} service(s) have errors: ${errors.map(r => `${r.name} (${r.message})`).join(', ')}`
      });
    }

    // Add voice-specific recommendation if ElevenLabs not configured
    const elevenLabsResult = results.find(r => r.service === 'elevenlabs');
    if (elevenLabsResult?.status === 'not_configured') {
      response.recommendations.push({
        type: 'info',
        message: 'Voice synthesis (TTS) requires ELEVENLABS_API_KEY',
        action: 'Add ELEVENLABS_API_KEY to enable "Listen to response" feature'
      });
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Health check failed',
      message: error.message
    });
  }
}
