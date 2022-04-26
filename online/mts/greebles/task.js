person = undefined
var timeline = []

var personal_identifier  = {
  type: "survey-text",
  questions: [ 
    { prompt: "Please enter any personal identifiers you'd like to use for this experiment. If you don't have any, just click below to continue.", 
  }
  ],
  button_label: "Click to begin",
  on_finish: function(data) {
    person = JSON.parse(data.responses)['Q0']
    console.log('person: ', person)
  }
}

//timeline.push( personal_identifier )
server_subject_id = jsPsych.randomization.randomID(20)

//timeline.push( personal_identifier )

// instructions up to practice trials: includes visualization of trials and responses
var instructions = {
  type: "instructions",
  pages: [
    // welcome page
    "<p style= 'font-size:200%' ><b>Welcome to our experiment!</b></br></p>" +
    "<p>We expect this HIT to take less than " + params.completion_time + " minutes; " +
    "you can earn up to $" + (params.maximum_bonus).toFixed(2) + "</b> depending on your performance.</p>" +
    "<p>We want you to perform really well, so we'll start off with some instructions.</p>",

    "<p style='font-size:150%'><b>Experimental layout</b></p>" + 
    "<p>After the instructions, there will be " + params.n_trials + " trials with an identical structure.</p>" +   
    "<p>You'll get feedback about your performance-bonus at the end.</p>",  

    // experiment descrition
    "<p style='font-size:150%'><b>Trials last less than " + (params.estimated_trial_duration)  + " seconds.</b></p>" +
    "<p>First, you'll see a single object briefly presented at the center of the screen." + 
    "<br>It will disappear quickly; remember it as best as you can.</p>" + 
    "<p>Then, you'll see two new objects; you'll decide which of these two objects <br>" + 
    "is more similar to the one that just disappeared.</p>",  
    
    // sample screen 
    "<p style='font-size:150%'><b>The first part of each trial is fast!</b></p>" + 
    "<p>The first object will appear at the beginning of each trial, and then <em>really quickly</em> disappear." + 
    "<br>You don't have to respond during this time; just look at the object and remember it for the next step.</p>" + 
    '<img style="width:35%" src="utils/sample.png"></img>' + 
    "<p>This is an example object. Try your best to remember this object before moving on.</p>" ,  
    
    // match screen 
    "<p style='font-size:150%'><b>In the second part of each trial you'll make a decision</b></p>" + 
    "<p>After the first object disappears you'll see two new objects almost immediately." +  
    "<br>One of them will be very similar to the one you just saw (the 'match') and the other will be different.</p>" +  
    '<img style="width:35%" src="utils/match.png"></img>' + 
    "<p>For example, the object on the LEFT is the match for the previous object." + 
    "<br>Feel free to look at the previous slide and make sure you can see why that's the correct answer.</p>",  
   
    // stating the objective 
    "<p style='font-size:150%'><b>You need to determine the match in each trial</b></p>" +
    "<p>You'll have " + (params.second_stim_duration/1000) + " seconds to respond in each trial, but it will take you less time than that.</p>" + 
    "<p>The relative size and rotation of the objects dont matter;<br> " + 
    "choose the object based on it's shape even if it's from a different viewpoint.</p>",  
   

    // keyboard responses 
    "<p style='font-size:150%'><b>Making responses with the arrow keys</b></p>" +
    "<p>You'll tell us which side of the screen the match is on by pressing either the left or right arrow key.<br>" + 
    "e.g. if the match in on the left, press the left arrow key; if the match is on the right, press the right arrow key.", 

    // bonus info
    "<p style='font-size:150%'><b>Bonus Info!</b></p>" +
    "<p>For every correct response you'll have <b>$" + params.trial_bonus.toFixed(2) + ' added to your bonus!</b> ' +
    "For incorrect responses <font color='red'><b>you'll loose  $" + params.trial_penalty.toFixed(2) +"!</b></font></p>" +
    "<p>We think you should be able to get a lot of them right if you're paying attention. " +
    "<br>If you don't get at least 50% correct, you wont earn any bonus at all.</p>",
  
    // timing info
    "<p style='font-size:150%'><b>Timing info</b></p>" +
    "<p>At the beginning of each trial, you'll see a cross (+) at the center of the screen. This just tells you were to look." +
    "<br>Remember that the first image will disappear really fast (!!!!). You'll have " + (params.second_stim_duration/1000) + " seconds to respond.<br>" +  
    "<p>This experiment is self-paced, so you'll begin each trial by pressing the space bar once you're instructed to." + 
    "<br>If you're doing the task consistently, you should be done in less than 10 minutes</p>",  

  ],
  show_clickable_nav: true,
  show_page_number: false,
  post_trial_gap: 500,
};

var consent_form = {
  type: 'html-keyboard-response',
  stimulus: '' +
    '<p style="font-size:140%"><b>Informed Consent</b></p>' +
    '<p>Before we get started, feel free to take a look at our consent form, and download a copy for your records if you like:<p>' +
    '<div style="padding:1%" >'  +
      "<embed src='utils/memory_lab_online_consent.pdf' width='100%' height='400px' style='border: 2px solid lightgrey';/>" +
    '</div>' +
    "<p>Press 'y' if you agree to participate in this study</p>" ,
  choices: ['y'],
}

var full_screen_start = {
 type: 'fullscreen',
 message: "" +
  '<p style="font-size:150%"><b>Now you\'re ready to start the experiment. </b></p>' +
  "<p>Remember: there's a bonus (+$" + params.trial_bonus.toFixed(2) + ") for each correct choice you make " +
  "and a penalty (-$" + params.trial_penalty.toFixed(2) + ") for each mistake!</p>" +
  "<p> You'll get feedback about your performance at the very end--not after every trial.</p>" + 
  "<p> Some trials will be easier than others, some will be harder; try your best and earn as much bonus as you can :D </p>" ,

  button_label: '<p style="color:"><b>Click to enter full screen and begin experiment</b></p>',
 fullscreen_mode: true
};

timeline.push( instructions, consent_form, full_screen_start ) 

var between_trial_instructions = { 
  type: 'html-keyboard-response', 
  stimulus: '<p></p>', 
  response_ends_trial: true,
  prompt: 'Press the space bar to begin the next trial',
  choices: ['space'], 
}

var fixation = { 
  type: 'html-keyboard-response', 
  stimulus: '<p><font size="20">+</font></p>', 
  response_ends_trial: false,
  trial_duration: params.fixation_duration,  
  prompt: '',
  choices: ['space'], 
}

trial_info = []
for (let i_type of Object.keys(params.stimuli)){ 
  for (let i_trial of params.stimuli[i_type]){
    trial_info.push( {'ambiguity':i_type, 'trial_number':i_trial }  ) 
  }
}
//timeline=[]
trial_info = shuffle(trial_info)//.splice(-10) 
preload_stimuli = []
for (i=0;i<trial_info.length;i++) { 
  
  trial = generate_trial_data(i) 

  var match_to_sample_trial = {
    type: 'match_to_sample',
    stimuli: [trial['sample'], trial['left'], trial['right']],
    prompt: "<p>Press either the right or left arrow key to indicate which image looked more like the previous one </p>",
    first_stim_duration: params.first_stim_duration,
    second_stim_duration: params.second_stim_duration, //'indefinite', // waits for subject's response
    gap_duration: params.match_to_sample_gap_duration,
    answer: trial['answer'], 
    meta: trial_info[i], 
    on_finish: function(data){
      console.log('on finish') 
      data.trial_type = 'experiment'
      //data.person = person
      // determine correct response from stimulus name
      // extract stimulus name from path to file

      data = format_data_for_server(data, mturk, params)
      save_trial_to_database(data)
      // console.log('trial data sent to server:', data)
      console.log('data:', data)
    }   
  } 
  timeline.push(between_trial_instructions, fixation, match_to_sample_trial)
  preload_stimuli.push(trial['sample'], trial['left'], trial['right'])
}

var debrief_block = {
  type: "survey-text",
  preamble: function() {
    var trial_bonus = params.trial_bonus
    var trial_penalty = params.trial_penalty
    var trials = jsPsych.data.get().filter({trial_type: 'experiment'});
    var correct_trials = trials.filter({correct: true});
    var incorrect_trials = trials.filter({correct: false});
    var aggregate_bonus = correct_trials.count() * params.trial_bonus - incorrect_trials.count() * params.trial_penalty
    var total_duration = ( jsPsych.data.getLastTrialData().values()[0].time_elapsed / 1000 / 60).toFixed(2)
    function getSum(total, num) { return total + num }

    trial_values = jsPsych.data.get().filter({trial_type: 'experiment'}).values()
    rts = []
    for (i in trial_values) { 
      rts.push(trial_values[i].rt)
    }
    total_doing = (rts.reduce(getSum) / 1000 / 60).toFixed(2)
    total_bonus = Math.min(params.maximum_bonus, Math.max(0, aggregate_bonus))
    accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    rt = (Math.round(correct_trials.select('rt').mean())/1000).toFixed(2)
    return "<p>You responded correctly on "+accuracy+"% of the trials</p>"+
    "<p><b>You earned a total of $" + total_bonus.toFixed(2) + '</b></p>'
  },
  questions: [
    { prompt: "We'd love to hear your thoughts about the experiment! " +
              "Was it hard, easy, boring--how did you solve the tasks?" +
              "<br>Any and all feedback is helpful :)",
      rows: 10,
      columns: 100
    }
  ],
  button_label: "Click to complete the experiment",

  on_finish: function(data){
    params.stimuli = undefined
    //data = {}
    data.person = person
    data.url = window.location.href
    data.high_ambiguity_averate_accuracy = get_average_from_object( jsPsych.data.get().filter({ambiguity: 'high'}).values() , 'correct')
    data.low_ambiguity_average_accuracy = get_average_from_object( jsPsych.data.get().filter({ambiguity: 'low'}).values() , 'correct')
    data.average_accuracy = accuracy
    data.experiment_duration = total_doing
    //data.n_practice_trials = i_practice_trial + 1
    data = format_data_for_server(data, mturk, params)
    data.trial_type = 'summary'
    data.total_bonus = Number(total_bonus.toFixed(2))
    data.average_rt = rt
    data.params=params
    data.hit_duration = ( jsPsych.data.getLastTrialData().values()[0].time_elapsed / 1000 / 60).toFixed(2)
    data.worker_feedback = JSON.parse(data.responses)['Q0'] // jsPsych.data.get().last(1).values()[0]['responses']
    save_trial_to_database(data)
    console.log(data)
  },
};


//timeline = timeline.splice(0, 5*3)
timeline.push( debrief_block ) 
jsPsych.init({
  timeline: timeline ,
  preload_images: preload_stimuli,  
  on_finish: function() {
    show_mturk_submit_button()
  },
});

function generate_trial_data(i) {

  match_numbers = shuffle([0,1,2]).splice(0,2)
  
  var i_type = trial_info[i]['ambiguity']
  var trial_number = trial_info[i]['trial_number']
  var sample = params.path_to_stimuli + i_type + '_' + trial_number + '_typical_' + match_numbers[0] + '.png'
  var match  = params.path_to_stimuli + i_type + '_' + trial_number + '_typical_' + match_numbers[1] + '.png'
  var oddity = params.path_to_stimuli + i_type + '_' + trial_number + '_oddity.png'
  var match_screen_order = [oddity, match] 
  var set_order = 1*(Math.random()>.5)
  var match_left = match_screen_order[1*!set_order]
  var match_right = match_screen_order[set_order]
  var answer = ['left', 'right'][set_order]
  
  return {'sample':sample, 'left':match_left, 'right':match_right, 'answer':answer}
}
