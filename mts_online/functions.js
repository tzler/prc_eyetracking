///////////////////////////////////////////// GENERIC NODE-BASED FUNCTIONS //////////////////////////////////////

// load node process 'io' as socket -- must be directed to app.js directory in index.html
socket = io.connect();

// define javascript facing node functions
save_trial_to_database = function(trial_data){
  socket.emit('insert', trial_data)
}

////////////////////////////////////////////// CUSTOM EXPERIMENT FUNCTIONS /////////////////////////////////////

function generate_trial(params, info){ 
  
  // all objects
  objects = shuffle(info['objects'])
  // shuffle which viewpoints are first, second, third
  trial_viewpoints = shuffle([0, 1, 2])
  // 
  object0 = objects[0]
  // select image on sample screen 
  image0 = info['images'][object0][trial_viewpoints[0]]
  // select match screen image (SAME) 
  image1 = info['images'][object0][trial_viewpoints[1]]    
  // determine type of condition

  i_comparison = shuffle(['configuration', 'structure', 'surface'])[0] 
 
  // determine object identity 
  object1 = shuffle( info['pairs'][i_comparison][object0] )[0]
  // determine image from object identity + a novel viewpoint 
  image2 = info['images'][object1][trial_viewpoints[2]]    
 
  correct_side = shuffle(['left', 'right'])[0]  

  left  = [image2, image1][ 1 * (correct_side == 'left' ) ] 
  right = [image2, image1][ 1 * (correct_side == 'right') ] 

  stimuli = [params.image_path+image0, params.image_path+left, params.image_path+right]
  correct_answer = [0, 1][ 1 * (correct_side=='left') ]
  
  // data to return  
  trial_structure_info = {
    stimuli: stimuli, 
    image_path: params.image_path, 
    answer: correct_answer,
    object0: object0, 
    object1: object1,
    trial_comparison: i_comparison, 
    diff_surface:   object0[4] != object1[4], 
    diff_structure: object0[5] != object1[5], 
    diff_configure: object0[6] != object1[6], 
  }
  return trial_structure_info
}
//
//function format_data_for_server(idata, params, trial_period){
//  var trial_data = {
//    'period': trial_period,
//    'subject_id': subject_id,
//    'experiment_id': experiment_id, 
//    'stimulus0': idata.meta.stimuli[0], 
//    'stimulus1': idata.meta.stimuli[1], 
//    'browser': get_browser_type(),
//    'collection': params.collection, 
//    'database': params.database, 
//    'iteration': params.iteration, 
//    'first_stim_duration': params.first_stim_duration
//  } 
//  Object.assign(trial_data, idata.meta) 
//  Object.assign(trial_data, idata)
//  delete trial_data["meta"]
//  delete trial_data['stimuli'] 
//  return trial_data 
//}
//
function format_summary_data(idata, params, trial_period){
  var trial_data = {
    'period': trial_period,
    'subject_id': subject_id,
    'experiment_id': experiment_id, 
    'browser': get_browser_type(),
    'url': window.location.href, 
    'collection': params.collection, 
    'database': params.database, 
    'iteration': params.iteration, 
    'first_stim_duration': params.first_stim_duration
  } 
  Object.assign(trial_data, idata) 
  Object.assign(trial_data, params)
  return trial_data 
}

////////////////////////////////////////////// GENERIC JS FUNCTIONS  /////////////////////////////////////

function get_browser_type(){
  var N= navigator.appName, ua= navigator.userAgent, tem;
  var M= ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if(M && (tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
  M= M? [M[1], M[2]]: [N, navigator.appVersion,'-?'];
  ////// includes version: ////////  return M.join(' '),
  return  M[0]
 };

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
