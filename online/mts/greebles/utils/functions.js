
// load node process 'io' as socket
socket = io.connect();

// define javascript facing node functions
save_trial_to_database = function(trial_data){
  socket.emit('insert', trial_data)
}


////////////////////////////////////////////// GENERIC HELPER FUNCTIONS /////////////////////////////////////

function get_average_from_object(_object_, _identifier_) { 
  
  if (_object_ != undefined) { 
    function get_sum(total, num) { return total + num }
    _values_ = []
    for (i in _object_) { 
      _values_.push(_object_[i][_identifier_]) 
    }
  
    return _values_.reduce(get_sum) / _object_.length
  }
}

convert_character = jsPsych.pluginAPI.convertKeyCharacterToKeyCode
convert_code = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter

function generate_stimuli_for_experiment(params){ 
  
  n_per_group  = params.n_practice_stimuli / 3

  // load all stimulus types 
  high_ambiguity = jsPsych.randomization.repeat(params.stimuli['high_ambiguity'], 1);
  low_ambiguity = jsPsych.randomization.repeat(params.stimuli['low_ambiguity'], 1);
  size = jsPsych.randomization.repeat(params.stimuli['size'], 1);
 
  // take the first index from each stimulus type to be the practice trials
  practice_stimuli = []
  practice_stimuli  = practice_stimuli.concat(high_ambiguity.slice(0, n_per_group), 
                                              low_ambiguity.slice(0, n_per_group), 
                                              size.slice(0, n_per_group))
  // define experimental stimuli as everything except the practice
  var stimuli_ = []
  stimuli_ = stimuli_.concat(high_ambiguity.slice(n_per_group), low_ambiguity.slice(n_per_group), size.slice(n_per_group))
  stimuli_ = shuffle(stimuli_).slice(0, params.n_trials)
  
  return {experiment: stimuli_, practice: shuffle(practice_stimuli) }
}


function generate_practice_block(stimuli, params) { 
  i_practice_trial = 0 
  
  var practice_trial  = {
    type: 'oddity-screen',
    stimulus: '',
    choices: [37, 38, 39],
    response_ends_trial: true,
    trial_duration: params.presentation_time,
    post_trial_gap: 200,
    on_start: function(data) {
      //last_trial = jsPsych.data.getLastTrialData().values()[0]
      last_trial = jsPsych.data.get().filter({trial_type: 'practice'}).last(1).values()[0]
      
      if (last_trial != undefined) { 
        if (last_trial.correct == true) {
          i_practice_trial = i_practice_trial + 1 
        }
      }  
    data.stimulus = params.path_to_stimuli + stimuli.practice[i_practice_trial]
    },
    on_finish: function(data) {

      data.trial_type = 'practice'
      // determine correct response from stimulus name
      data.correct_response= Number(data.stimulus.slice(data.stimulus.length - 5)[0])
      // convert location to arrow direction to keyboard press
      correct_response_key = convert_character( params.key_map[data.correct_response] )

      if (correct_response_key==data.key_press){
        console.log('correct')
        data.correct = true
      } else {
        console.log('incorrect')
        data.correct = false
      }

      practice_trials = jsPsych.data.get().filter({trial_type: 'practice'})
      n_practice_trials = practice_trials.count()

      correct_count = practice_trials.filter({correct:true}).count()
      if ( ( correct_count >= params.n_practice_stimuli)  ) {
        data.practice_threshold_met = true
      }
    }
  }

  // practice trial feedback
  var practice_inter_trial_screen  = {
    type: 'image-keyboard-response',
    stimulus: '',
    // prompt is conditional -- changes once they meet criterion
    prompt: function() {

      // feedback about whether they got the answer right
      emoji = ['incorrect D:', 'correct :D'][jsPsych.data.get().last(1).filter({correct:true}).count()]
      // change display if they've met the practice threshhold
      practice_met = jsPsych.data.get().filter({practice_threshold_met:1}).count()
      if (practice_met) { 
        emoji = ''
        exit = '<p style="font-size:150%"><b>Great :D </p><p>Press the space bar to move on</b></p>'
      } else { exit = '<p>Press the space bar to begin another practice trial</p>'}
      // set complete feedback string to present to subjects
      display = '<p style="font-size:200%"><b>'+emoji+'</b></p>'+exit
      return display
    },
    choices: ['space', 'enter'],
  }


  // block with conditional loop based on criterion performance
  var  practice_block= {
    timeline: [ practice_trial, practice_inter_trial_screen],
    loop_function: function(data){

      practice_trials = jsPsych.data.get().filter({trial_type: 'practice'})
      n_practice_trials = practice_trials.count()

      if (n_practice_trials > 4) {
        correct_count = practice_trials.last(5).filter({correct:true}).count()
      } else { correct_count = 0}

      practice_met = jsPsych.data.get().filter({practice_threshold_met:1}).count()
      if ( ( practice_met) ){
        return false; // break loop
      } else {
        return true; // continue loop
      }
    }
  }

  return practice_block
}

function format_data_for_server(trial_data, mturk, params) { 
  if (mturk.worker_id) { 
    trial_data.worker_id = mturk.worker_id
    trial_data.assignment_id = mturk.assignment_id
    trial_data.hit_id = mturk.hit_id
  } else { 
    trial_data.server_subject_id = server_subject_id //jsPsych.randomization.randomID(20)
  }

  trial_data.browser = get_browser_type()
  trial_data.collection = params.collection 
  trial_data.database = params.database
  trial_data.iteration = params.iteration
  return trial_data
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function get_random_index(list) {
  return Math.floor(Math.random()*list.length)
}

////////////////////////////////////////////// GENERIC MTURK FUNCTIONS /////////////////////////////////////

function show_mturk_submit_button(){

  submit_button = document.createElement('div');
  submit_button.innerHTML = "" + 
  "<div id='hidden_button' style='position: absolute; top:50%; left: 50%; '>" + 
    "<form name='hitForm' id='hitForm' method='post' action=''>" + 
      "<input type='hidden' name='assignmentId' id='assignmentId' value=''>" + 
      "<input type='submit' name='submitButton' id='submitButton' value='Submit' class='submit_button'>" + 
    "</form>" + 
  "</div>"

  document.body.appendChild(submit_button);
  document.getElementById('hitForm').setAttribute('action', get_submission_url())
  document.getElementById('assignmentId').setAttribute('value', get_turk_param('assignmentId')) 

}

function get_submission_url(){
  if (window.location.href.indexOf('sandbox')>0) {
      console.log('SANDBOX!')
      submission_url = 'https://workersandbox.mturk.com/mturk/externalSubmit'
  } else {
      console.log('REAL LYFE!')
      submission_url = "https://www.mturk.com/mturk/externalSubmit"
    }
  return submission_url
}
 
function get_turk_param( param ) {
  // worker id : 'workerId'
  // assignmen ID : 'assignmentId'
  // hit ID : 'hitId'
  var search_term = "[\?&]"+param+"=([^&#]*)";
  var reg_exp = new RegExp( search_term );
  var search_url = window.location.href;
  results = reg_exp.exec( search_url );
  if( results == null ) {
      return undefined 
  } else {
    return results[1];
  }
}

function set_turk_params(){
  var mturk = {
    worker_id: get_turk_param('workerId'), 
    assignment_id: get_turk_param('assignmentId'),
    hit_id: get_turk_param('hitId'), 
  }
  return mturk 
}

mturk = set_turk_params() 
////////////////////////////////////////////// MANAGE ZOOM SETTINGS /////////////////////////////////////

function get_browser_type(){
  var N= navigator.appName, ua= navigator.userAgent, tem;
  var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  ////// includes version: ////////  return M.join(' '),
  return  M[0]
 };

