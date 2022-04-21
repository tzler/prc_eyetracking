///////////////////////////////////////////// GENERIC NODE-BASED FUNCTIONS //////////////////////////////////////

// load node process 'io' as socket -- must be directed to app.js directory in index.html
socket = io.connect();

// define javascript facing node functions
save_trial_to_database = function(trial_data){
  socket.emit('insert', trial_data)
}

////////////////////////////////////////////// CUSTOM EXPERIMENT FUNCTIONS /////////////////////////////////////


function generate_trial(params, info){

  // determine comparison for this trial
  i_comparison = shuffle(['configuration', 'structure', 'surface'])[0]

  // get a shuffled list of all objects
  objects = shuffle(info['objects'])
  // shuffle which viewpoints are first, second, third
  trial_viewpoints = shuffle([0, 1, 2])

  // identify which object will be repeated
  object0 = objects[0]
  // determine object identity of the odd-one-out
  object1 = shuffle( info['pairs'][i_comparison][object0] )[0]

  // determine first of the repeated images
  image0 = info['images'][object0][trial_viewpoints[0]]
  // determine second of the repeated images
  image1 = info['images'][object0][trial_viewpoints[1]]
  // determine image of odd-one-out and get instance from novel viewpoint
  image2 = info['images'][object1][trial_viewpoints[2]]

  if (params['experiment_type'] == 'sequential_mts') {

    correct_side = shuffle(['left', 'right'])[0]

    left  = [image2, image1][ 1 * (correct_side == 'left' ) ]
    right = [image2, image1][ 1 * (correct_side == 'right') ]
    trial_stimuli = [params.image_path+image0, params.image_path+left, params.image_path+right]
    correct_answer = [0, 1][ 1 * (correct_side=='left') ]
  
  } else if (params['experiment_type'] == 'concurrent') {

    trial_stimuli = [ params.image_path + image0, params.image_path + image1]
    random_location = Math.round(Math.random() * trial_stimuli.length)
    trial_stimuli.splice(random_location, 0, params.image_path + image2)
    correct_answer = random_location + 1
  }

  // data to return
  trial_structure_info = {
    stimuli: trial_stimuli,
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

function generate_trial_old(params, info){ 
  
  //console.log('funtions.js', stimulus_info)  
  i_comparison= shuffle(Object.keys(info['pairs']))[0] 
  // all objects
  objects = shuffle(info['objects'])
  // shuffle which viewpoints are first, second, third
  trial_viewpoints = shuffle([0, 1, 2])
  // select oddity 
  oddity_object =  objects[0]
  // identify all typicals for this comparison
  typical_objects = info['pairs'][i_comparison][ oddity_object ]
  // select typical within this comparison
  typical_object = shuffle(typical_objects)[0]
  
  // select tpyical images + sample without replacement from viewpoints 
  var i_oddity  = params.image_path + info['images'][oddity_object][trial_viewpoints[0]]
  var i_typical = params.image_path + info['images'][typical_object][trial_viewpoints[1]]
  var j_typical = params.image_path + info['images'][typical_object][trial_viewpoints[2]]
  var trial_stimuli = []  
  trial_stimuli.push(i_typical) 
  trial_stimuli.push(j_typical)
  // insert oddity at random location in stimuli to finalize choice array 
  random_location = Math.round(Math.random()*trial_stimuli.length)
  trial_stimuli.splice(random_location, 0, i_oddity);
  ///// what are some other things that we should include in the trial data we're saving?  
  // data to return  
  trial_structure_info = {
    stimuli:trial_stimuli,
    image_path: params.image_path, 
    answer: random_location+1,
    typical_object: typical_object, 
    oddity_object: oddity_object,
    trial_comparison: i_comparison,
    diff_surface: oddity_object[4] == typical_object[4], 
    diff_structure: oddity_object[5] == typical_object[5], 
    diff_configure: oddity_object[6] == typical_object[6], 
    blender_metadata: info['metadata'][oddity_object.slice(0, 3)], 
    //typical_metadata: info['metadata'][typical_object], 
    model_distance: info['model_distance'][typical_object][oddity_object]
  }  
  return trial_structure_info
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
