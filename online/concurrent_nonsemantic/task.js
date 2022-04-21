var save_to_server = 1 

//capture info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');
jsPsych.data.addProperties({
  subject_id: subject_id,
  study_id: study_id,
  session_id: session_id
});

// instructions up to practice trials: includes visualization of trials and responses
var instructions = {
  type: "instructions",
  pages: [
    // welcome page
    "<p style= 'font-size:200%' ><b>Welcome to our experiment!</b></br></p>" + 
    "<p>We want you to perform well, so we'll start off with some instructions.</p>", 
    // example trial 
    "<p style='font-size: 150%'><b>Experiment Layout</b></p>" +
    "<p>In each trial, you'll be looking at three black and white images at the center of the screen, similar to this:</p>" + 
    "<dev>" +
      '<img style="width:20%" src="images/008_001_view02.png"></img>' +
      '<img style="width:20%" src="images/008_001_view01.png"></img>' + 
    "</dev>" + 
    "<br>" + 
    "<dev>" + 
      '<img style="width:20%" src="images/008_000_view00.png"></img>' + 
    "</dev>" + 
    "<p>Two of the images will be of the same object shown from different viewpoints." + 
    "<br>One of these images will be of a different object. We'll call the different object <b>the oddity</b>. </p>", 
    // explicit about oddity in example trial
    "<p style='font-size:150%'><b>Your goal</b><p>" + 
    "<p>In every trial, your task is to look at all the images presented to you and select the oddity. </p>" + 
    "<dev>" +
      '<img style="width:20%" src="images/008_001_view02.png"></img>' +
      '<img style="width:20%" src="images/008_001_view01.png"></img>' + 
    "</dev>" + 
    "<br>" + 
    "<dev>" + 
      '<img style="width:20%" src="images/008_000_view00.png"></img>' + 
    "</dev>" + 
    "<p>In the example above top two images are of the same object, shown from different viewpoints and lighting conditions." + 
    "<br>The oddity is on the bottom. Make sure you can see the difference between them before moving on!</p>",  
    // condition description
    "<p style='font-size:150%'><b>The same object will be presented in different ways!</b><p>" +
    "<p>The images below, for example, " +
    "are all of the SAME object shown from different viewpoints, sizes, and with different lighting:</p>" +
    "<dev>" +
      '<img style="width:30%" src="images/008_111_view00.png"></img>' +
      '<img style="width:30%" src="images/008_111_view01.png"></img>' +
      '<img style="width:30%" src="images/008_111_view02.png"></img>' +
    "</dev>" +
    "<p>It's really important that you " +
    "<b>ignore these viewpoint/size/lighting differences</b> and pay attention to the object itself.</p>",
    // surface condition description
    "<p style='font-size:150%'><b>Understanding how objects will be different from each other in this experiment</b><p>" +
    "<p>To help you recognize when objects are different, we're going to show you a couple of examples of how objects change</p>" +
    "<p>Make sure you study each of these differences—they're the same difference we'll use throughout the experiment!</p>",
   //
    "<p style='font-size:130%'><b>These objects are different because of their *surface* properties</b><p>" +
    "<p>There will be 3 different kinds of surfaces in this experiment; two are shown here.</p>" +
    "<p>Make sure you understand the surface-level difference in these two images before moving on.</p>" +
    "<dev>" +
      '<img style="width:35%" src="images/008_110_view00.png"></img>' +
      '<img style="width:35%" src="images/008_010_view01.png"></img>' +
    "</dev>",
    // structure condition description
    "<p style='font-size:130%'><b>These objects are different because of their *structure*</b><p>" +
    "<p>The large parts of these objects are combined differently—it's the same pieces in a different combination.</p>" +
    "<p>Make sure you understand the structure-level difference in these two images before moving on.</p>" +
    "<dev>" +
      '<img style="width:35%" src="images/008_110_view02.png"></img>' +
      '<img style="width:35%" src="images/008_100_view00.png"></img>' +
    "</dev>",
    // part location condition description
    "<p style='font-size:130%'><b>These objects are different because of the *rotation* of the smallest object part</b><p>" +
    "<p>The small part of these two objects are the same but are each rotated differently--we'll call this a different 'configuration.'</p>"+
    "<p>Make sure you understand the rotation-level difference in these two images before moving on.</p>" +
    "<dev>" +
      '<img style="width:35%" src="images/008_010_view02.png"></img>' +
      '<img style="width:35%" src="images/008_011_view01.png"></img>' +
    "</dev>",
     // part location condition description
    "<p style='font-size:130%'><b>These objects are the same</b><p>" +
    "<p>While these objects are presented from different viewpoints and sizes, with different lighting, they are the same.<p>" +
    "<p>To be the same, two images have to have the same surface, structure, and small-part rotations</p>" +
    "<dev>" +
      '<img style="width:35%" src="images/008_110_view00.png"></img>' +
      '<img style="width:35%" src="images/008_110_view02.png"></img>' +
    "</dev>",
    //
    "<p style='font-size:150%'><b>Make sure you understand these differences</b></p>" +
    "<p>All the differences between objects will be from their surface, structure, or rotation.</p>", 
    
    
    
    // keyboard responses
    "<p style='font-size: 150%'><b>Response keys</b></p>" +
    "Once you identify the oddity, you'll have to use the following keys on your keyboard to select it: &#x2190;, &#x2192; or &#x2193; </p>" + 
      "<dev>" +
      '<img style="width:20%" src="images/008_001_view02.png"></img>' +
      '<img style="width:20%" src="images/008_001_view01.png"></img>' + 
    "</dev>" + 
    "<br>" + 
    "<dev>" + 
      '<img style="width:20%" src="images/008_000_view00.png"></img>' + 
    "</dev>" + 
    "<p>" + 
      "<b>&#x2190;</b> (Left Arrow) Object on the left" + 
      '<b>&#x2192;</b> (Right Arrow) Object on the right' + 
      "<b>&#x2193;</b> (Down Arrow) Object on bottom<br>" + 
    "<br> For this set of images the correct answer would be <b>&#x2193;</b> (Down Arrow)</p>",
     // difficulty info 
    "<p style='font-size: 150%'><b>Difficulty</b></p>" + 
    "<p>Sometimes finding the oddity will be quick and easy. Other times it will take more time.</p>" +
    "<p>This should be fun and challenging, so make sure you take your time in each trial!" ,  
     // timing info
    "<p style='font-size: 150%'><b>Timing information</b></p>" +
    "<p>You have ten seconds to complete each trial; if you don't respond in this time the trial will be marked as incorrect.</p>",  
    "<p style='font-size: 150%'><b>Practice trials</b></p>" + 
     // practice trial description 
    "<p>We'll give you a few practice trials now, to get familiar with the response keys and see what the experiment is like.<br>" + 
    "We'll also tell you which type of difference you should be attending to in this trial, with a label on the bottom.</p>" + 
    "<p>Once you get " + params.practice_criterion + " right you'll move on to the consent form, then the experiment itself.</p>", 
  ], 
  choices: ['space'],
  show_clickable_nav: true,
  show_page_number: false,
  post_trial_gap: 500,
  on_start: function(){
    document.body.style.backgroundColor = params['experiment_color']
  }, 
  on_finish: function(){ 
    document.body.style.backgroundColor = params['experiment_color']
    document.body.style.cssText = document.body.style.cssText + "color: " + params['textcolor']
  }
};

// set up practivce trial choice array 
var practice_trial  = {
  type: 'choice-array',
  stimuli: '',   
  period: 'practice',
  trial_duration: params.max_decision_time, 
  on_start: function(data) {
    test_trial = generate_trial(params, stimulus_info)
    data.stimuli =  test_trial.stimuli
    data.meta = test_trial
    data.answer = test_trial['answer'] 
  }, 
  on_finish: function(data) {
    if (save_to_server) { save_trial_to_database(data) }
    else { console.log('task.js.choice-array.practice:', data)}

  }
}

// set up practice trial feedback to each choice
var practice_inter_trial_screen  = {
  type: 'image-keyboard-response',
  stimulus: '',
  // prompt is conditional -- changes once they meet criterion
  prompt: function() {
    // feedback about whether they got the answer right
    //emoji = ['incorrect D:', 'correct :D'][jsPsych.data.get().last(1).filter({correct:true}).count()]
    //itrial_type = jsPsych.data.getLastTimelineData().values()[0]['trial_comparison']
    // trial_comparison  
    return '<p>Press the space bar to begin another practice trial</p>'
    // set complete feedback string to present to subjects
    //display = '<p style="font-size:200%"><b>'+emoji+'</b></p>'+exit
    //return display
  }, 
  choices: ['space'],
}

// set up block with conditional loop based on criterion performance
var  practice_block= {
  timeline: [ practice_trial, practice_inter_trial_screen],
  loop_function: function(data){
    practice_trials = jsPsych.data.get().filter({period: 'practice'})
    correct_count = practice_trials.filter({correct:true}).count() 
    if ( correct_count >= params.practice_criterion ) { 
      return false; // break loop 
    } else {
      return true; // continue loop 
    }
  }, 
}

var consent_form = { 
  type: 'html-keyboard-response', 
  stimulus: '' + 
    '<p style="font-size:140%"><b>Nice work!</b></p>' + 
    '<p>Before we get started, feel free to take a look at our consent form, and download a copy for your records if you like:<p>' + 
    '<div style="padding:1%" >'  + 
      "<embed src='utils/memory_lab_online_consent.pdf' width='100%' height='400px' style='border: 2px solid lightgrey';/>" + 
    '</div>' + 
    "<p>Press 'y' if you agree to participate in this study.</p>" ,  
  choices: ['y'],
  on_finish: function(){
    document.body.style.backgroundColor = params['experiment_color']
  }, 
}

// set up experimental screens between trials
var inter_trial_screen  = {
  type: 'image-keyboard-response',
  stimulus: '',
  prompt: '<p>Press the space bar to begin the next trial</p>',  
  choices: ['space'], 
}


//// set up experimental screens between trials
//var inter_trial_screen  = {
//  type: 'image-keyboard-response',
//  stimulus: '',
//  prompt: function() { 
//    if (params.feedback) { 
//      emoji = ['D:', ':D'][jsPsych.data.get().last(1).filter({correct:true}).count()]
//    } else { emoji = '' } 
//    feedback = '<p><b>' + emoji + '</b></p><p>Press the space bar to begin the next trial</p>' 
//    return feedback}, 
//  choices: ['space'], 
//}
//

var all_stimuli = [] 
// generate stimuli for experiment with the right distributionss
for (ii=0; ii < params.n_trials; ii++) {
  i_trial = generate_trial(params, stimulus_info)
  var trial_info  = {
    type: 'choice-array',
    stimuli: i_trial.stimuli,
    answer: i_trial.answer, 
    trial_duration: params.max_decision_time,
    meta: i_trial, 
    period: 'experiment', 
    on_finish: function(data) {
      if (save_to_server) { save_trial_to_database(data) }
      else { console.log('trial finish', data) }        
    }
  }
  all_stimuli.push(trial_info)
}

var full_screen_start = {
 type: 'fullscreen',
 message: "" +  
  '<p style="font-size:150%"><b>Now you\'re ready to start the experiment. </b></p>' + 
  "<p>You'll have ten seconds to find the oddity in each trial, and remember:</p>" + 
//  "<p>There's a bonus (+$" + params.trial_bonus.toFixed(2) + ") for each correct choice you make " + 
//  "and a big penalty (-$" + params.trial_penalty.toFixed(2) + ") for each mistake!<p>" + 
  "<p>In the experiment, you'll receive feedback at the end of the experiment, not after every trial</p>", 
  button_label: '<p style="color:"><b>Click to enter full screen and begin experiment</b></p>', 
 fullscreen_mode: true, 
 on_finish: function(){ 
  document.body.style.backgroundColor = params['experiment_color']
 }
};

var experiment_debrief = { 
  type: "survey-text",
  preamble: function() {
    var trials = jsPsych.data.get().filter({period: 'experiment'});
    mu = (trials.select('correct').mean() * 100).toFixed(0)
    rt = (trials.select('rt').mean()/1000).toFixed(2)
    //types = [...new Set(trials.select('trial_comparison').values)]
    feedback = "<p>Your accuracy was  "+mu+"% with an average time to respond of "+rt+ " seconds</p>"
    return feedback
  },
  questions: [{ prompt: "We'd love to hear your thoughts about the experiment! " +
                        "<br> Was it hard, easy, boring--did it take too long? And how did you solve the tasks?" +
                        "<br>Any and all feedback is helpful :)",
             rows: 10,
             columns: 100}],
  button_label: "Click to complete the experiment",
  on_finish: function(data){
    data.period = 'summary'
    data.worker_feedback = JSON.parse(data.responses)['Q0']
    trials = jsPsych.data.get().filter({period:'experiment'})
    data.average_accuracy = trials.select('correct').mean()
    data.average_rt = trials.select('rt').mean()
    data.n_trials = trials.count()
    data.browser = get_browser_type()
    Object.assign(data, params)
    if (save_to_server){ save_trial_to_database(data) }
    else { console.log('final', data)}
  },
};

// POPULATE TIMELINE 
var timeline = [] 
// instructions
timeline.push(instructions);
// practice block
timeline.push(practice_block)
// consent form
//timeline.push(consent_form)
// final reminder 
timeline.push(full_screen_start)
// shuffle stimuli
shuffled_stims = shuffle(all_stimuli) 
// add each trial to timeline + iti
for (i=0; i < all_stimuli.length; i++) { 
  timeline.push(shuffled_stims[i], inter_trial_screen)
}
// add debrief block
timeline.push(experiment_debrief)
// initialize jsPsych experiment  
jsPsych.init({
  timeline: timeline,
  on_finish: function() { 
    // define mturk exit protocol
    console.log('pew pew!')
    window.location = 'https://app.prolific.co/submissions/complete?cc=646F5880'
    // 'https://app.prolific.co/submissions/complete?cc=546D0558'
  },
});
