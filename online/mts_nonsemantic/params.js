params = { 

  stimulus_type: 'nonsemantic',
  experiment_type: 'sequential_mts', 
  
  // number of trials correct in a row before practice is over
  practice_criterion: 5, // n right to move on 
  // total number of trials in experiment
  n_trials: 10, 
  // trial by trial feedback during experiment
  feedback: true, 
  // bonus per each correct response
  trial_bonus : .10, 
  // penalty for each incorrect response
  trial_penalty : .15, 
  // max time per trial till marked as incorrect
  max_decision_time : 10000, // 20 seconds
  // color to begin experiment (matches w/ example stimuli) 
  background_color:  "#DEDEDE", 
  // 
  experiment_color: "#303030",
  // might delete soon if not on mturk
  max_experiment_bonus: 2.00, 
  // 
  image_path: '../stimuli/nonsemantic/',
  //
  noise_mask: '../stimuli/white_noise.jpeg', 
  // 
  // estimate for average time to complete each trial
  estimate_seconds_per_trial : 4,
  // mapping between keys used in experiment and object locations
  key_: {37:1, 39:2}, // 40: 3
  //
  experiment_id: jsPsych.randomization.randomID(20),
  // server info
  database : 'mts', 
  collection : 'non_semantic',
  iteration : 'prepilot',
  ratio_samediff: .6, 
  presentation_time: 10000,
  trial_bonus: .05,
  trial_penalty: .03,
  trial_completion_estimate: 2,
  n_practice_stimuli: 6,
  fixation_duration: 500,
  first_stim_duration: [100],  // , 200, 300, 400, 500, 600, 700, 800], 
    //200,// 'self_paced', //'self_paced',// in milliseconds — or 'self_paced',
  second_stim_duration: 5000,
  noisemask_duration: 100,
  maximum_bonus: 2,
  estimated_trial_duration: 5,
}

params.completion_time =  Math.ceil((params.n_trials * params.estimate_seconds_per_trial)/60)
params.cutoff_percent = (100 * ( ( params.trial_penalty ) / ( params.trial_bonus + params.trial_penalty) )).toFixed(0)
