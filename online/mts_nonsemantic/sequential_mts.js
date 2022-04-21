/**
 * sequential match-to-sample
 * tyler's modified Josh de Leeuw scripts
 * plugin to create a sequential match to sample trial structure, 
 * with two images on the match screen
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['sequential_mts'] = (function() {
  var plugin = {};
  jsPsych.pluginAPI.registerPreload('sequential_mts', 'stimuli', 'image')
  plugin.info = {
    name: 'sequential_mts',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'The images to be displayed.'
      },
      noise_mask: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Noise',
        //default: 'images/white_noise.jpeg',
        array: true,
        description: 'The mask images to be displayed after the stimulus.'
      },  
      same_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Same key',
        default: 49, // https://keycode.info/
        description: ''
      },
      different_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'Different key',
        default: 48, // https://keycode.info/
        description: 'The key that subjects should press to indicate that the two stimuli are the same.'
      },
      first_stim_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'First stimulus duration',
        default: 1000,
        description: 'How long to show the first stimulus for in milliseconds.'
      },
      first_stim_prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: '<p>Press the spacebar when you wish to continue to the next image</p>', 
        description: 'Press the spacebar when you wish to continue'
      }, 
      advance_key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        pretty_name: 'First stimulus duration',
        default: ['space'],
        description: 'How long to show the first stimulus for in milliseconds.'
      }, 
      noisemask_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: '',
        default: 500,
        description: 'How long to show the noise mask after the first image.'
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
      period : {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'useful meta info', 
        default: 'experiment',
        description: 'tyler addition'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: "<p>Press '0' if the object on the left is the same as the last image. Press '1' if the object on the right is the same as the last image</p>",
        description: 'Any content here will be displayed below the stimulus.'
      },
      feedback_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Feedback duration time',
        default: 1000,
        description: 'How long to show feedback after responding on each trial.'
      }, 
    }
  }

  plugin.trial = function(display_element, trial) {
    
    // as the trial begins get the time 
    var start_time = Date.now()
    // setup variable to save timeing info
    var first_stim_info 
    // 
    var first_stimulus_duration 

    // show the first image 
    display_element.innerHTML = '<img class="sequential-stimulus0" src="' + trial.stimuli[0] + '"></img>';
    
    // set protocol for either self paced or fixed time 
    if (trial.first_stim_duration == 'self_paced') {
      // if there's a stimulus prompt, add it to the screen 
      display_element.innerHTML += trial.first_stim_prompt
      // wait for keyboard responses to move on to next screen 
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: afterKeyboardResponse,
        valid_responses: trial.advance_key, 
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    
    // otherwise, only present stimulus for fixed duration (in ms) 
    } else {
      // MAYBE UPDATE THIS LATER TO BE MORE TEMPORALLY ACCURATE????
          // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
      // if there are numerous possible presentation lengths, pick one 
      if (trial.first_stim_duration.length) {
        // set a timeout function
        jsPsych.pluginAPI.setTimeout(function() {mask_image();}, shuffle(trial.first_stim_duration)[0]);
      // otherwise just set with the single value 
      } else {
        // set a timeout function
        jsPsych.pluginAPI.setTimeout(function() {mask_image();}, trial.first_stim_duration);
      }
    } 
    
    // mask image with white noise from a jpeg  
    function mask_image() {
      // first, determine duration of stimulus on sample screen 
      first_stimulus_duration = Date.now() - start_time
      // specifiy image attributes 
      image_attributes = 'width="' +window.innerWidth + '" height="'+ window.innerHeight +'" style="opacity:0.5"' 
      // mask with white noise 
      display_element.innerHTML = '<img class="noise_stimulus"' + image_attributes + 'src="' + trial.noise_mask + '"></img>';
      // show the next screen after a delay of noisemask_duration
      jsPsych.pluginAPI.setTimeout(function() { show_second_stimulus();}, trial.noisemask_duration);
    }
    
    // jsPsych given function
    function afterKeyboardResponse(info) {
      first_stim_info = info;
      mask_image();
    }

    function show_second_stimulus() {
      
      // 
      var html = '<div>' + 
        '<img class="sequential-stimulus1" src="' + trial.stimuli[1] + '"></img>' + 
        '<img class="sequential-stimulus2" src="' + trial.stimuli[2] + '"></img>' + 
        '</div>' 

      //show prompt
      if (trial.prompt !== null) {
        html += trial.prompt;
      }
      
      // update screen with images + possible prompt 
      display_element.innerHTML = html;
      
      var after_response = function(info) {
        
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
        
        var response = {49:1, 48:0}[ info.key ] 
        if (response == trial.answer ) {
          correct = true;
        } else { 
          correct = false; 
        }
        //console.log('sequential_same_different.js', trial) 
        var trial_data = {
          'subject_id': subject_id,
          'experiment_id': experiment_id,
          'period':trial.period,
          'sample_image': trial.stimuli[0].slice(params.image_path.length), 
          'match_screen_stimulus_left': trial.stimuli[1].slice(params.image_path.length), 
          'match_screen_stimulus_right': trial.stimuli[2].slice(params.image_path.length), 
          // 'stimulus0_durationset': params.first_stim_duration, 
          'sample_duration': first_stimulus_duration, 
          'match_screen_rt': Math.round(info.rt), 
          'correct_response': trial.answer, 
          'key_press': info.key, 
          'response': response,
          'correct': correct,
          'browser': get_browser_type(),
          'collection': params.collection,
          'database': params.database,
          'iteration': params.iteration,
        }
        
        // get sample image rt if it was a self paced trial 
        if ( trial.first_stim_duration == 'self_paced') {  
          trial_data[ 'stimulus0_rt' ] =  first_stim_info.rt 
        }    
        
        if ( params['feedback'] == true ){ 
          if (trial_data.correct){ 
            display_element.innerHTML = '<p style="color:black; font-size:200%">correct! <br><br> &#128516;</p>'
          } else { 
            display_element.innerHTML = '<div style="color:black; font-size:200%">incorrect <br><br> &#128557;</div>'
          }
        } else { 
          display_element.innerHTML = ''
        }
        
        // migrate metadata over to single variable 
        Object.assign(trial_data, trial.meta)

        jsPsych.pluginAPI.setTimeout(function() { 
          jsPsych.finishTrial(trial_data) 
        }, 1000);
      }
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [trial.same_key, trial.different_key],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }
  };
  return plugin;
})();
