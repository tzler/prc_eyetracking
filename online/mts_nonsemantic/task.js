save_to_server = 0

//capture info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');
experiment_id = jsPsych.randomization.randomID(20)

var manual = 1

if (manual){ 
  var self_identify  = {
    type: "survey-text",
    questions: [{ 
      prompt: "Please enter any personal identifiers you'd like to use for this experiment." + 
              "<br> If you don't have any, just click below to continue."}],
    button_label: "click to begin",
    on_finish: function(data) {
      experiment_id = jsPsych.randomization.randomID(20)
      subject_id = JSON.parse(data.responses)['Q0']
      jsPsych.data.addProperties({
        subject_id: subject_id,
        study_id: study_id,
        session_id: session_id
      });
      if (subject_id.length == 0){
        subject_id = jsPsych.randomization.randomID(20)
      }
    }
  }
} else { 
  jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id
  });
}

img_path = params['image_path'] 

// instructions up to practice trials: includes visualization of trials and responses
var instructions = {
  type: "instructions",
  pages: [
    // welcome page
    "<p style= 'font-size:200%' ><b>Welcome to our experiment!</b><br></p>" +
    "<p>This experiment consists of relatively fast visual decisions that vary in difficulty.</p>" +  
    "<p>We'll go through some instructions, a few practice trials, then start the experiment.</p>" ,
    // begin each trial
    "<p style='font-size:150%'><b>Initiating each trial</b></p>" +
    "<p>To begin each experimental trial, you'll press the spacebar. Take your time and only begin each trial when you're ready!</p>" +  
    "<p>Once you've begun, each trial should take less than 5 seconds.</p>",
    // study screen description  
    "<p style='font-size:150%'><b>The 'study' screen</b></p>" +
    "<p>Once you begin the trial you'll see a single image on the <b>study</b> screen, like the example below.</p>" + 
      '<img style="width:35%" src="'+params['image_path']+'008_000_view00.png"></img>' + 
    "<br>You'll have to study this image to understand it's physical properties (e.g. shape, texture).</p>",  
    // disappears 
    "<p style='font-size:150%'><b>The image on the study screen will disappear!</b></p>" + 
    "<p>The study image will disappear after a relatively small period of time, so you'll have to pay close attention while it's visible.</p>" + 
    "<p>When the study image disappears there will be a brief flash of white noise, which you can ignore.</p>" ,  
   // decision screen description 
    "<p style='font-size:150%'><b>The 'decision' screen</b></p>" + 
    "<p>Then, two other images will appear, side by side. One will be the same object presented from a different viewpoint/size/etc." + 
    "<br>The other image will be of a different—but still similar—object.</p>" + 
    "<div>"+ 
      '<img style="width:25%" src="'+params['image_path']+'/008_000_view02.png"></img>' + 
      '<img style="width:25%" src="'+params['image_path']+'/008_100_view01.png"></img>' + 
    "</div>"+ 
    "<p>Your task is to determine which of these two images match the object that was on the study screen." + 
    "<br>If you think the 'match' object is on the left, press the '1', if you think the 'match' object is on the right, press '0'.</p>" +  
    "<p>Given the study screen earlier in the instructions, and this decision screen, the 'match' object is on the left." +  
    "<br>To get this trial correct, then, you'd press '1'</p>" ,  
    // condition description
    "<p style='font-size:150%'><b>The same object will be presented in different ways!</b><p>" + 
    "<p>The images below, for example, " + 
    "are all of the SAME object shown from different viewpoints, sizes, and with different lighting:</p>" + 
    "<dev>" +  
      '<img style="width:30%" src="'+params['image_path']+'/008_111_view00.png"></img>' + 
      '<img style="width:30%" src="'+params['image_path']+'/008_111_view01.png"></img>' + 
      '<img style="width:30%" src="'+params['image_path']+'/008_111_view02.png"></img>' + 
    "</dev>" + 
    "<p>It's really important that you " + 
    "<b>ignore these viewpoint/size/lighting differences</b> and pay attention to the object itself.</p>", 
    // examples 
    "<p style='font-size:150%'><b>Some examples of how objects will be different from each other</b><p>" + 
    "<p>To help you recognize when objects are different, we're going to show you a couple of examples of how objects change</p>" +  
    "<p>Make sure you study each of these differences—they're the same difference we'll use throughout the experiment!</p>",  
    // surface condition description 
    "<p style='font-size:130%'><b>These objects are different because of their *surface* properties</b><p>" + 
    "<p>There will be 3 different kinds of surfaces in this experiment; two are shown here.</p>" +
    "<p>Make sure you understand the surface-level difference in these two images before moving on.</p>" + 
    "<dev>" +  
      '<img style="width:35%" src="'+params['image_path']+'008_110_view00.png"></img>' + 
      '<img style="width:35%" src="'+params['image_path']+'008_010_view01.png"></img>' + 
    "</dev>", 
    // structure condition description
    "<p style='font-size:130%'><b>These objects are different because of their large-scale structure </b><p>" + 
    "<p>The large parts of these objects are combined differently—it's the same pieces in a different combination.</p>" +
    "<p>Make sure you understand the structure-level difference in these two images before moving on.</p>" + 
    "<dev>" +  
      '<img style="width:35%" src="'+params['image_path']+'008_110_view02.png"></img>' + 
      '<img style="width:35%" src="'+params['image_path']+'008_100_view00.png"></img>' + 
    "</dev>", 
    // part location condition description
    "<p style='font-size:130%'><b>These objects are different because of their small-scale structure</b><p>" + 
    "<p>The small part of these two objects are the same but are each rotated differently</p>"+ 
    "<p>Make sure you understand the small-scale differences before moving on.</p>" + 
    "<dev>" +  
      '<img style="width:35%" src="'+params['image_path']+'008_010_view02.png"></img>' + 
      '<img style="width:35%" src="'+params['image_path']+'008_011_view01.png"></img>' + 
    "</dev>", 
     // part location condition description
    "<p style='font-size:130%'><b>These objects are the same</b><p>" + 
    "<p>While these objects are presented from different viewpoints and sizes, with different lighting, they are the same.<p>" + 
    "<p>To be the same, two images have to have the same surfaces, large- and small-scale structure.</p>" + 
    "<dev>" +  
      '<img style="width:35%" src="'+params['image_path']+'008_110_view00.png"></img>' + 
      '<img style="width:35%" src="'+params['image_path']+'008_110_view02.png"></img>' + 
    "</dev>", 
    // final condition description 
    "<p style='font-size:150%'><b>Make sure you understand these differences</b></p>" + 
    "<p>All the differences between objects will be from their surface, large-scale or small-scale structure</p>" + 
    "<p>TIP: Make sure that you pay attention to these properties when looking at the first image!</p>", 
    // practice trial intro 
    "<p style='font-size:150%'><b>Practice Trials</b></p>" + 
    "<p>To give you a better sense of what the experiment is going to be like, we'll give you a chance to practice.</p>" + 
    "<p>This is a great opportunity to make sure that you understand these surface, structure, and rotation differences!</p>" + 
    "<p>We'll give you feedback after every trial to make sure you're attending to these object properties</p>"
  ],
  show_clickable_nav: true,
  show_page_number: true,
  post_trial_gap: 200,
  on_start: function(){ 
    document.body.style.backgroundColor = params['background_color']
  }
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
  "<p> Some trials will be easier than others, some will be harder—just try your best :)  </p>" ,
  button_label: '<p style="color:"><b>Click to enter full screen and begin experiment</b></p>',
  fullscreen_mode: true
};

// set up practivce trial choice array
var practice_trial  = {
  type: 'sequential_mts',
  stimuli: '', //['', '', ''],
  noise_mask: params['noise_mask'], 
  response_ends_trial: true,
  on_start: function(data) {
    test_trial = generate_trial(params, stimulus_info)
    data.stimulus_info = test_trial
    data.stimuli =  test_trial.stimuli
    data.period = 'practice'
    data.first_stim_duration =  params.first_stim_duration  // 'self_paced' or some number 
    data.second_stim_duration = params.second_stim_duration 
    data.noisemask_duration = params.noisemask_duration
    data.answer = test_trial['answer']
    data.meta = test_trial
  },
  on_finish: function(data) {
    //data = format_data_for_server(data, params, 'practice')
    console.log('on_finish:', data) 
    if (save_to_server){ save_trial_to_database(data) }
    else { console.log('on_finish:', data) } 
  }
}

// set up practice trial feedback to each choice
var practice_inter_trial_screen  = {
  type: 'image-keyboard-response',
  stimulus: '',
  prompt: function() {
    //emoji = ['incorrect D:', 'correct :D'][jsPsych.data.get().last(1).filter({correct:true}).count()]
    display = '<p>Press the space bar to begin another practice trial</p>'
    //display = '<p style="font-size:200%"><b>'+emoji+'</b></p>'+exit
    return display
  },
  choices: ['space', 'enter'],
}

var  practice_block= {
  timeline: [ practice_trial, practice_inter_trial_screen],
  loop_function: function(data){
    practice_trials = jsPsych.data.get()
    correct_count = practice_trials.filter({correct:true}).count()
    if ( correct_count >= params.practice_criterion ) {
      return false; // break loop
    } else {
      return true; // continue loop
    }
  },
}

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
  choices: '', //['space'], 
}

function generate_experiment(trials){ 
  for (i=0;i<params.n_trials;i++) { 
    var trial = generate_trial(params, stimulus_info) 
    var same_different_trial = {
      type: 'sequential_mts',
      stimuli: trial.stimuli,
      noise_mask: params['noise_mask'],
      first_stim_duration: params.first_stim_duration,
      second_stim_duration: params.second_stim_duration, 
      noisemask_duration: params.noisemask_duration,
      meta: trial,  
      answer: trial['answer'], 
      on_finish: function(data){
        if (save_to_server){ save_trial_to_database(data) }
        else { console.log('on_finish: data', data) } 
      }   
    } 
    trials.push(between_trial_instructions, fixation, same_different_trial)
  }
  return trials
}

var debrief_block = {
  type: "survey-text",
  preamble: function() {
    var trials = jsPsych.data.get().filter({period: 'experiment'});
    mu = (trials.select('correct').mean() * 100).toFixed(0)
    rt = (trials.select('match_screen_rt').mean()/1000).toFixed(2)
    //types = [...new Set(trials.select('trial_comparison').values)]    
    feedback = "<p>Your accuracy was  "+mu+"% with an average time to respond of "+rt+ " seconds</p>"
    return feedback 
  },
  questions: [{ prompt: "We'd love to hear your thoughts about the experiment! " +
                        "<br> Was it hard, easy, boring—how did you solve the tasks?" +
                        "<br>Any and all feedback is helpful :)",
             rows: 10,
             columns: 100}],
  button_label: "Click to complete the experiment",
  on_finish: function(data){
    data.period = 'summary'
    data.worker_feedback = JSON.parse(data.responses)['Q0']
    trials = jsPsych.data.get().filter({period:'experiment'})
    data.average_accuracy = trials.select('correct').mean()
    data.average_rt = trials.select('stimulus1_rt').mean()
    data.n_trials = trials.count()
    data.browser = get_browser_type()
    Object.assign(data, params)
    if (save_to_server){ save_trial_to_database(data) }
    else { console.log('final', data) } 
  },
};

timeline = [] 
//timeline.push(self_identify)
timeline.push(instructions) 
timeline.push(practice_block)
timeline.push(consent_form)
timeline.push(full_screen_start)
timeline = generate_experiment(timeline)
timeline.push(debrief_block) 

jsPsych.init({
  timeline: timeline ,
  on_finish: function() {
    console.log('pew pew!')
    window.location = 'https://theuselessweb.com/' // 'https://app.prolific.co/submissions/complete?cc=546D0558'
  },
});
