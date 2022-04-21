params = { 
  //
  stimulus_type: 'nonsemantic', 
  experiment_type: 'concurrent',

  // number of trials correct in a row before practice is over
  practice_criterion : 3,
  // total number of trials in experiment
  n_trials: 3,
  // trial by trial feedback during experiment
  feedback: true, 
  // bonus per each correct response
  trial_bonus : .10, 
  // penalty for each incorrect response
  trial_penalty : .15, 
  // max time per trial till marked as incorrect
  max_decision_time : 20000, // 20 seconds
  // color to begin experiment (matches w/ example stimuli) 
  background_color:  "#CECECE", 
  // 
  experiment_color: '#CECECE' ,//'#7D7D7D', //"#303030",
  //
  textcolor: 'black', 
  // might delete soon if not on mturk
  max_experiment_bonus: 2.00, 
  // 
  image_path: '../stimuli/nonsemantic/', 
  // 
  choice_array : 'concurrent_3objects',
  // estimate for average time to complete each trial
  estimate_seconds_per_trial : 5,
  // mapping between keys used in experiment and object locations
  key_map: {37:1, 40:3, 39:2},
  //
  //experiment_id: jsPsych.randomization.randomID(20),
  // server info
  database : 'nonsemantic', 
  collection : 'concurrent',
  iteration : 'simple_set_prolifictest0',
  image_size: 300, 
}

params.completion_time =  Math.ceil((params.n_trials * params.estimate_seconds_per_trial)/60)
params.cutoff_percent = (100 * ( ( params.trial_penalty ) / ( params.trial_bonus + params.trial_penalty) )).toFixed(0)
