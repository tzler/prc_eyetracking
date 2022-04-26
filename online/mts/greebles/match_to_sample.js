/**
 * match_to_sample
 * tyler's modified Josh de Leeuw scripts
 *
 * plugin to create a match to sample trial structure, with two images on the match screen
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['match_to_sample'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('match_to_sample', 'stimuli', 'image')

  plugin.info = {
    name: 'match_to_sample',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The images to be displayed.'
      },
      answer: {
        type: jsPsych.plugins.parameterType.SELECT,
        pretty_name: 'Answer',
        options: ['left', 'right'],
        default: 75,
        description: 'Either "left" or "right".'
      },
      left_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Same key',
        default: 39,
        description: ''
      },
      right_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Different key',
        default: 37,
        description: 'The key that subjects should press to indicate that the two stimuli are the same.'
      },
      first_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'First stimulus duration',
        default: 1000,
        description: 'How long to show the first stimulus for in milliseconds.'
      },
      gap_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Gap duration',
        default: 500,
        description: 'How long to show a blank screen in between the two stimuli.'
      },
      second_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Second stimulus duration',
        default: 1000,
        description: 'How long to show the second stimulus for in milliseconds.'
      },
      stimulus_path: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'path to stimuli',
        default: null,
        description: 'tyler addition'
      },
      meta : {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'useful meta info', 
        default: null,
        description: 'tyler addition'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {
    
    display_element.innerHTML = '<img class="jspsych-match_to_sample-stimulus" src="' + trial.stimuli[0] + '"></img>';

    var first_stim_info;
    if (trial.first_stim_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        showBlankScreen();
      }, trial.first_stim_duration);
    } else {
      function afterKeyboardResponse(info) {
        first_stim_info = info;
        showBlankScreen();
      }
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterKeyboardResponse,
        valid_responses: trial.advance_key,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }
    function showBlankScreen() {
      display_element.innerHTML = '';

      jsPsych.pluginAPI.setTimeout(function() {
        showSecondStim();
      }, trial.gap_duration);
    }

    function showSecondStim() {

      var html = '<p>' +
                  '<img class="jspsych-match_to_sample-stimulus1" src="' + trial.stimuli[1] + '"></img>' + 
                  '<img class="jspsych-match_to_sample-stimulus2" src="' + trial.stimuli[2] + '"></img>' + 
                 '</p>'; 
      
      //show prompt
      if (trial.prompt !== null) {
        html += trial.prompt;
      }

      display_element.innerHTML = html;

      if (trial.second_stim_duration > 0) {
        jsPsych.pluginAPI.setTimeout(function() {
          
          var trial_data = {
            "rt": undefined, 
            "correct": false,
            "sample_image": trial.stimuli[0].slice(20),
            "match_image_left": trial.stimuli[1].slice(20), 
            "match_image_right": trial.stimuli[2].slice(20), 
            "key_press": undefined, 
            "correct_response": trial.answer, 
            "response": undefined,
            "ambiguity":trial.meta.ambiguity, 
            "original_trial_number":trial.meta.trial_number,
            "sample_presentation_time":trial.first_stim_duration,
            "match_presentation_time": trial.second_stim_duration, 
            "match_to_sample_gap_duration": trial.gap_duration, 
          };

        display_element.innerHTML = '';

        jsPsych.finishTrial(trial_data);
        
        }, trial.second_stim_duration);
      }

      var after_response = function(info) {

        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();

        var correct_answer = trial.answer
        var response = ['left', 'right'][ 1 * (info.key==39) ] 
        if (response == trial.answer ) {
          correct = true;
        } else { 
          correct = false; 
        }
        
        var trial_data = {
          "rt": Math.round( info.rt ), 
          "correct": correct,
          "sample_image": trial.stimuli[0].slice(20),
          "match_image_left": trial.stimuli[1].slice(20), 
          "match_image_right": trial.stimuli[2].slice(20), 
          "key_press": info.key, 
          "correct_response": correct_answer, 
          "response": response,
          "ambiguity":trial.meta.ambiguity, 
          "original_trial_number":trial.meta.trial_number,
          "sample_presentation_time":trial.first_stim_duration,
          "match_presentation_time": trial.second_stim_duration, 
          "match_to_sample_gap_duration": trial.gap_duration, 
        };
        
        if (first_stim_info) {
          trial_data["rt_stim1"] = first_stim_info.rt;
          trial_data["key_press_stim1"] = first_stim_info.key;
        }

        display_element.innerHTML = '';

        jsPsych.finishTrial(trial_data);
      }
      
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.left_key, trial.right_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });

    }

  };

  return plugin;
})();
