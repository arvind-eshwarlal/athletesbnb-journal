const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 5001;
 
// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://athletesbnb-journal.vercel.app',
    'https://athletesbnb-journal-3twsyq4dr-arvind-eshwarlals-projects.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
 
// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
 
// Test route
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running!' });
});
 
// POST /journal/preferences - Set user sport + level
app.post('/journal/preferences', async (req, res) => {
  try {
    const { athletesbnb_user_id, sport, level, goals } = req.body;
 
    console.log('Received preferences:', { athletesbnb_user_id, sport, level, goals });
 
    if (!athletesbnb_user_id || !sport || !level) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    console.log('Attempting to insert user into Supabase...');
 
    // Insert user
    const { data, error } = await supabase
  .from('users')
  .insert([{ 
    id: athletesbnb_user_id, 
    athletesbnb_user_id: athletesbnb_user_id,
    sport, 
    level,
    goals: goals || []
  }])
  .select();
 
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
 
    console.log('User created successfully:', data);
    res.json({ success: true, user: data[0] });
  } catch (err) {
    console.error('Catch error:', err);
    res.status(500).json({ error: err.message });
  }
});
 
// POST /journal/entries - Create journal entry
app.post('/journal/entries', async (req, res) => {
  try {
    const {
      user_id,
      session_type,
      voice_transcript,
      user_notes,
      intensity,
      quick_tap_value,
      sleep_quality,
      nutrition,
      soreness_notes,
      next_session_notes
    } = req.body;
 
    console.log('Received journal entry request:', { user_id, session_type, intensity });
 
    if (!user_id || !session_type || !voice_transcript) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    console.log('Saving journal entry to Supabase...');
 
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id,
          session_type,
          voice_transcript,
          user_notes,
          intensity,
          quick_tap_value,
          sleep_quality,
          nutrition,
          soreness_notes,
          next_session_notes,
          session_date: new Date().toISOString().split('T')[0]
        }
      ])
      .select();
 
    if (error) {
      console.error('Supabase error saving entry:', error);
      return res.status(500).json({ error: error.message });
    }
 
    console.log('Journal entry saved successfully:', data[0].id);
    res.json({ success: true, entry: data[0] });
  } catch (err) {
    console.error('Error in POST /journal/entries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT /journal/entries/:entry_id - Update entry
app.put('/journal/entries/:entry_id', async (req, res) => {
  try {
    const { entry_id } = req.params;
    const { session_type, voice_transcript, intensity } = req.body;

    console.log('Updating entry:', entry_id);

    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        session_type,
        voice_transcript,
        intensity,
        updated_at: new Date().toISOString()
      })
      .eq('id', entry_id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    console.log('Entry updated successfully:', data[0].id);
    res.json({ success: true, entry: data[0] });
  } catch (err) {
    console.error('Error updating entry:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /journal/insights - Generate insight with Claude
app.post('/journal/insights', async (req, res) => {
  try {
    const { entry_id, voice_transcript, session_type, intensity, level, sport, goals } = req.body;
 
    console.log('Received insight request:', { entry_id, session_type, intensity, level, sport, goals });
 
    if (!entry_id || !voice_transcript) {
      console.error('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
 
    console.log('Generating insight with Claude...');
 
    // Step 1: Generate initial insight
    const goalsText = goals && goals.length > 0 ? goals.join(', ') : 'general training';
    const insightPrompt = `You are a supportive coach and trusted friend speaking to a ${level} level ${sport} athlete.

Their primary focus areas are: ${goalsText}.

Your tone is warm, honest, and growth-minded.
 
The athlete just logged a ${session_type} session with intensity ${intensity}/10:
 
"${voice_transcript}"
 
Generate ONE insight that:
- Acknowledges what they did well
- Addresses a challenge they mentioned
- Gives one actionable next step toward their focus areas
- Stays encouraging but honest
- Uses ${sport}-specific language
- Is 2-4 sentences max
 
Sound like a friend, not a textbook.`;
 
    console.log('Calling Claude API...');
 
    const insightResponse = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-sonnet-4-6',
        max_tokens: 150,
        messages: [{ role: 'user', content: insightPrompt }]
      },
      {
        headers: { 
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
 
    console.log('Claude response received');
 
    let insight_text = insightResponse.data.content[0].text;
    console.log('Insight generated:', insight_text);
 
    // Step 2: Self-evaluate (SIMPLIFIED FOR MVP)
    const quality_score = 85; // Default score for MVP
 
    console.log('Saving insight to database...');
 
    // Step 3: Save insight to database
    const { data, error } = await supabase
      .from('insights')
      .insert([
        {
          entry_id,
          insight_text,
          quality_score,
          regeneration_count: 0,
          self_eval_scores: { note: 'MVP - self-eval disabled' },
          generated_at: new Date().toISOString()
        }
      ])
      .select();
 
    if (error) {
      console.error('Supabase error saving insight:', error);
      return res.status(500).json({ error: error.message });
    }
 
    console.log('Insight saved successfully:', data[0].id);
    res.json({
      success: true,
      insight: data[0],
      quality_score
    });
  } catch (error) {
    console.error('\n❌ CLAUDE API ERROR:');
    console.error('Status:', error.response?.status);
    console.error('Error type:', error.response?.data?.type);
    console.error('Error message:', error.response?.data?.error?.message);
    console.error('Full response:', JSON.stringify(error.response?.data, null, 2));
    
    // Only send response if not already sent
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate insight',
        details: error.response?.data?.error?.message || error.message
      });
    }
  }
});
 
// GET /journal/entries - Fetch user's entries
app.get('/journal/entries/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
 
    console.log('Fetching entries for user:', user_id);
 
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
 
    if (error) {
      console.error('Supabase error fetching entries:', error);
      return res.status(500).json({ error: error.message });
    }
 
    console.log('Entries fetched successfully:', data.length);
    res.json({ success: true, entries: data });
  } catch (err) {
    console.error('Error in GET /journal/entries:', err.message);
    res.status(500).json({ error: err.message });
  }
});
 

// GET /journal/summary/:user_id - Get weekly summary with Claude synthesis
app.get('/journal/summary/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
 
    console.log('Fetching weekly summary for user:', user_id);
 
    // Fetch user to get their goals
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('sport, level, goals')
      .eq('id', user_id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError);
      return res.status(500).json({ error: userError.message });
    }

    const { sport, level, goals } = userData || {};
    const goalsText = goals && goals.length > 0 ? goals.join(', ') : 'general training';
 
    // Calculate date range (last 7 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
 
    // Fetch entries from last 7 days
    const { data: entries, error: fetchError } = await supabase
      .from('journal_entries')
      .select('id, session_type, voice_transcript, intensity, created_at')
      .eq('user_id', user_id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });
 
    if (fetchError) {
      console.error('Supabase error fetching entries:', fetchError);
      return res.status(500).json({ error: fetchError.message });
    }
 
    if (!entries || entries.length === 0) {
      return res.json({
        summary: {
          sessionCount: 0,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          },
          insights: [],
          weeklySynthesis: ''
        }
      });
    }
 
    // Fetch insights for these entries
    const entryIds = entries.map(e => e.id);
    const { data: insightsData, error: insightsError } = await supabase
      .from('insights')
      .select('entry_id, insight_text')
      .in('entry_id', entryIds);
 
    if (insightsError) {
      console.error('Supabase error fetching insights:', insightsError);
      return res.status(500).json({ error: insightsError.message });
    }
 
    // Create a map of entry_id -> insight for quick lookup
    const insightMap = {};
    if (insightsData) {
      insightsData.forEach(insight => {
        insightMap[insight.entry_id] = insight.insight_text;
      });
    }
 
    // Build insights list with session type
    const insightsList = entries
      .filter(entry => insightMap[entry.id])
      .map(entry => ({
        insight_text: insightMap[entry.id],
        session_type: entry.session_type
      }));
 
    // Prepare insights for Claude
    const insightsText = insightsList
      .map(item => `[${item.session_type}] ${item.insight_text}`)
      .join('\n');
 
    // If no insights, return empty summary
    if (insightsList.length === 0) {
      return res.json({
        summary: {
          sessionCount: entries.length,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString()
          },
          insights: [],
          weeklySynthesis: 'Log more sessions to get insights and weekly analysis.'
        }
      });
    }
 
    // Generate weekly synthesis with Claude
    let weeklySynthesis = '';
    try {
      const synthesisResponse = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `You are a sports coach analyzing a ${level} level ${sport} athlete's week of training.

Their focus areas are: ${goalsText}.

Here are all the coaching insights from their sessions this week:
 
${insightsText}
 
Based on these insights, provide a brief weekly synthesis (2-3 sentences) that:
1. Identifies the main themes or patterns you notice
2. Highlights progress toward their focus areas
3. Gives one actionable recommendation for next week
 
Keep it concise and motivating. Speak directly to the athlete.`
            }
          ]
        },
        {
          headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
          }
        }
      );
 
      if (synthesisResponse.data.content && synthesisResponse.data.content.length > 0) {
        weeklySynthesis = synthesisResponse.data.content[0].text;
      }
    } catch (claudeError) {
      console.error('Error generating weekly synthesis:', claudeError.response?.data || claudeError.message);
      weeklySynthesis = 'Great week of training! Keep building on the momentum.';
    }
 
    // Prepare response
    const summary = {
      sessionCount: entries.length,
      dateRange: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      insights: insightsList,
      weeklySynthesis
    };
 
    console.log('Weekly summary generated successfully');
    res.json({ summary });
  } catch (err) {
    console.error('Error generating weekly summary:', err.message);
    res.status(500).json({ error: err.message });
  }
});
 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`💚 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Server error:', err);
  process.exit(1);
});
 
process.on('uncaughtException', (err) => {
  console.error('Uncaught error:', err);
  process.exit(1);
});
