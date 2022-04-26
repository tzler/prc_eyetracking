/**
 * choice-array
 *  tyler
 *
 * plugin for displaying a 3-way  choice array and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/
jsPsych.plugins["choice-array"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('choice-array', 'stimulus', 'image');

  plugin.info = {
    name: 'choice-array',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: [37, 39, 40], //jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: '', 
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      answer: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'The correct response XD',
        default: null,
        description: 'Data to pass along.'
      },
      stim_info: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: '',
        default: null,
        description: 'Data to save.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    image_1 = trial.stimuli[0]
    image_2 = trial.stimuli[1]
    image_3 = trial.stimuli[2]

    img_size = params['image_size']
    var new_html = trial.prompt
    new_html += '<br><div>' + 
      '<div>' + 
        '<img width="' + img_size + '" height="' + img_size + '" style="flex: 1"  src="' + image_1 + '" id="istimulus"></img>'+
        '<img width="' + img_size + '" height="' + img_size + '" style="flex: 2" src="' + image_2 + '" id="istimulus"></img>'+
      '</div>' + 
      '<div style="text-align:center" >' +
        '<img width="' + img_size + '" height="' + img_size + '" style="flex: 3" src="'+ image_3 + '" id="istimulus"></img>'+
      '</div>' 
    
    if (trial.period=='practice'){ 
      new_html += '<div>' + trial.meta.trial_comparison +' difference</div>'
    }
    
    // draw
    display_element.innerHTML = new_html;
    
    // store response
    var response = {
      rt: null,
      key: null,
      answer: trial.meta.answer,
    };

    // function to end trial when it is time
    var end_trial = function() {
    
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }
      
      // 'response' is automatically populated below
      var trial_data = {
          'subject_id': subject_id,
           //'experiment_id': experiment_id,
          'period':trial.period,
          'stimulus0': trial.stimuli[0].slice(params.image_path.length),
          'stimulus1': trial.stimuli[1].slice(params.image_path.length),
          'stimulus2': trial.stimuli[2].slice(params.image_path.length),
          'rt': Math.round( response.rt ),
          'timed_out': response.rt == undefined, 
          'correct': trial.answer == params.key_map[response.key],
          'key_press': response.key,
          'answer': trial.answer,
          'trial_number': jsPsych.data.get().filter({period: trial.period}).count(), 
          'response': response,
          'browser': get_browser_type(),
          'collection': params.collection,
          'database': params.database,
          'iteration': params.iteration,
      } 
      
      Object.assign(trial_data, trial.meta)

      // get sample image rt if it was a self paced trial
      if ( trial.first_stim_duration == 'self_paced') {
        trial_data[ 'stimulus0_rt' ] =  first_stim_info.rt
      }
      
      if ( params['feedback'] == true ){
        if (trial_data.correct){
          
          display_element.innerHTML = '<div style="color:black; font-size:200%">correct! <br><br> &#128516;</div>'
        } else {
          display_element.innerHTML = '<div style="color:black; font-size:200%">incorrect <br><br> &#128557;</div>'
        }
      } else {
        display_element.innerHTML = ''
      }
     
      // pause before moving on 
      jsPsych.pluginAPI.setTimeout(function() {
        jsPsych.finishTrial(trial_data)
      }, 500);
    };

    // function to handle responses by the subject
    var after_response = function(info) {
      
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      display_element.querySelector('#istimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#istimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        trial.timed_out = true
        end_trial();
      }, trial.trial_duration);
    }
  };
  return plugin;
})();
