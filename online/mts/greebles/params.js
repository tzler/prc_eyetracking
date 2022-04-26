params = {
  presentation_time: 10000,
  trial_bonus: .05, 
  trial_penalty: .03,  
  path_to_stimuli: '../../stimuli/greebles/', 
  trial_completion_estimate: 2,
  database: 'oddity', 
  collection: 'greeble',
  iteration: 'development', 
  n_practice_stimuli: 6, 
  fixation_duration: 500, 
  first_stim_duration: 150,
  second_stim_duration: 5000,
  match_to_sample_gap_duration: 100,
  maximum_bonus: 2,
  estimated_trial_duration: 5, 
}

params.stimuli = { 
'high': 
  ['40', '9', '8', '20', '34', '21', '37', '22', '36', '32', '26', '27', '33', '25', '31', '18', '30', '29', '15', '14', '28', '16', '17', '13', '12', '10', '38', '39', '11', '6', '7', '5', '1', '3', '2'], 
  'low': 
  ['35', '21', '20', '22', '36', '37', '23', '27', '33', '32', '26', '18', '30', '25', '31', '19', '2', '40', '6', '7', '5', '4', '9', '8', '14', '28', '29', '15', '17', '16', '12', '13', '39', '11', '10'], 
} 

var n_trials = params.stimuli['high'].length + params.stimuli['low'].length
params.n_trials = n_trials - params.n_practice_stimuli
params.completion_time = Math.ceil((params.trial_completion_estimate * params.n_trials + (params.first_stim_duration/1000)* params.n_trials )/60) + 1 

