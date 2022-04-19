from psychopy import core, visual, event, monitors
from datetime import datetime
import os, sys, pandas, numpy as np
import pylink, eyelink_functions

def generate_differentmatch(params, trialinfo):
    
    def flip_value(x, i): 
        """flip the value of the string (0->1| 1->0) at a given index"""
        return str(abs(int(x[i])-1))
    def random_value():
        """just generates a random 1 or 0 formatted as a string"""
        return str(np.random.randint(2))
    
    # extract name of object
    name = trialinfo['sample_identity'] 
    
    if params['distance_protocol'] == 'uniform':
        # change everything with equal probability
        i_distance = np.random.permutation([0, 1, 2])[0] 
    elif params['distance_protocol'] == 'same_surface': 
        # only select pairs that have the same surface
        i_distance = np.random.permutation([0, 1])[0] 
    elif params['distance_protocol'] == 'small_component_shift': 
        # pair objects that only vary in small component
        i_distance = 0
    
    if i_distance == 0: 
        # only changes the small-component configuration
        match_identity = name[0:2] + flip_value(name, 2) 
    if i_distance == 1:                                  
        # changes the large component configuration + randomizes small component
        match_identity = name[0] + flip_value(name,1) + random_value() 
    if i_distance == 2:                                                          
        #changes large component + randomizes large/small components
        match_identity = flip_value(name,0) + random_value() + random_value() 
    
    return match_identity 

def get_identity(x): 
    return x[4:7]

def get_viewpoint(x): 
    return x[8:14] 
 
def generate_match_images(params, trial_info): 
   
    # get all images in this experiment 
    images = np.random.permutation(os.listdir(params['image_directory']))
    # determine what identity of trial image is 
    trial_info['sample_identity'] = sample_identity = get_identity( trial_info['sample_image'] ) 
    # determine what the viewpoint of the trial image is 
    trial_info['sample_viewpoint'] = sample_view = get_viewpoint( trial_info['sample_image'] ) 
    
    # find other rotations of sample image
    sample_rotations = [i for i in images if (sample_identity in i) * (sample_view not in i) ]
    # select a different rotation of the sample image 
    match_image = np.random.permutation(sample_rotations)[0]
    
    # generate a match identity that's different from the sample image 
    foil = generate_differentmatch(params, trial_info) 
    # identify all images with this match identity that have a different viewpoint than the sample image
    foil_images = [i for i in images if (foil in i) * (sample_view not in i) * (get_viewpoint(match_image) not in i) ]
    # select a single image of this different identity 
    foil_image = np.random.permutation(foil_images)[0] 
    # create single dictionary with both possibilities
    same_different_options = {'same': match_image, 'different': foil_image}
    
    return same_different_options, trial_info

def setup_match_screen(window, params, trial_info): 
    """generates a pair of possible match-screen images and selects these based on the experimental protocol"""
    
    matches, trial_info = generate_match_images(params, trial_info) 
    
    # define match image   
    if params['match_screen_type'] == 'single': 
        
        ######## makes this a sequential same-different task
        
        # randomly determine whether this will be a same or different trial (and save this value)
        trial_answer = ['different', 'same'] [ 1 * (np.random.random() > params['proportion_same'])]
        # select the image we've generated for this (either same or different) trial         
        match_screen_image = matches[ trial_answer ]
        # generate the path to this image 
        match_image_path = os.path.join(params['image_directory'], match_screen_image) 
        # define match image
        match_stimulus = visual.ImageStim(window, image=match_image_path)
        # project sample image on the back-screen 
        match_stimulus.draw()
        
        # save information into trialdata for later analysis
        trial_info['keyboard_map'] = {'0':'different', '1':'same'}
        trial_info['answer'] = trial_answer 
        trial_info['match_image'] = match_screen_image
        trial_info['match_identity'] = get_identity(match_screen_image) 
        trial_info['match_viewpoint'] = get_viewpoint(match_screen_image) 
    
    elif params['match_screen_type'] == 'double': 
        
        ######### makes this a sequential match-to-sample task
        
        # determine whether the correct answer is going to be on the left or right 
        trial_answer = ['left', 'right'] [ 1 * (np.random.random()>.5)] 
        # decide how much to shift each image by (here, i think .5 = half the distance from 0,0 to the edge
        shift = [ -(params['screen_width']/5) , params['screen_width']/5] 
        # determine the path to the same and different images 
        match_image_path = os.path.join(params['image_directory'], matches['same'])
        diff_image_path =  os.path.join(params['image_directory'], matches['different'])
 
        # position and same and different images on either the left or right of the screen 
        match_stimulus = visual.ImageStim(window, image=match_image_path, pos=(shift[trial_answer=='right'], 0))
        diff_stimulus = visual.ImageStim(window, image=diff_image_path, pos=(shift[trial_answer!='right'], 0))
        
        # project sample image on the back-screen 
        match_stimulus.draw()
        diff_stimulus.draw()
        
        # save infomation into trial data for later analysis
        trial_info['keyboard_map'] = {'1': 'left', '0': 'right'} 
        trial_info['matchscreen_same'] = matches['same'] 
        trial_info['answer'] = trial_answer 
        trial_info['matchscreen_same_identity'] = get_identity(matches['same'] ) 
        trial_info['matchscreen_same_viewpoint'] = get_viewpoint(matches['same']) 
        trial_info['matchscreen_different'] = matches['different'] 
        trial_info['matchscreen_different_identity'] = get_identity(matches['different'] ) 
        trial_info['matchscreen_different_viewpoint'] = get_viewpoint(matches['different']) 
    
    # REMEMBER: we haven't visualize match screen at the point 
    # clear the keyboard buffer (for memory + data collection purposes) 
    event.clearEvents()        
 
    return window, trial_info

def generate_mask(window, image_path, seconds_to_display): 
    """generates a mask using the sample image"""
    
    # dont understand the details about this function yet 
    noise1 = noise = visual.NoiseStim(
                win=window, name='noise',units='pix',
                noiseImage=image_path, 
                mask='circle',
                ori=1.0, pos=(0, 0), size=(512, 512), sf=None, phase=0,
                color=[1,1,1], colorSpace='rgb', opacity=1, blendmode='add', contrast=1,
                #texRes=1024,
                #filter='None', 
                #imageComponent='Phase', 
                noiseType='image', #'white', 
                noiseElementSize=4, 
                noiseBaseSf=32.0/512,
                )
    # draw mask on the back screen 
    noise.draw() 
    # show mask 
    window.flip()
    # determine time of mask
    clock = core.Clock()
    # wait for alotted time 
    while clock.getTime() < seconds_to_display: pass
    # remove mask — by displaying nothing 
    window.flip()

def pre_trial_setup(window, genv, params): 
    """ 
    1. ask for keypress to initiate trial
    2. recalibrate using a fixation 
    3. return eyetracker object prepped for trial 
    """
    
    # define text to show at beginning of/to initiate each trial 
    initiate_trial_screen = visual.TextStim(window, 'press spacebar to begin the next trial') 
    # draw on back screen 
    initiate_trial_screen.draw()
    # display back screen 
    window.flip()
    
    # wait for keyboard response to initiate trial 
    if event.waitKeys()[0] == 'space': 
        pass
    elif event.waitKeys()[0] in ['q', 'escape']: 
        exit() 
    
	# gaze recalibration from fixation
    el_tracker = eyetracker_setup_for_trial(window, genv, params) 

    return el_tracker

def sample_screen_protocol(window, el_tracker, params, trial_info): 
   
    # set the path to trial image  
    sample_image_path = os.path.join(params['image_directory'], trial_info['sample_image'])
    # define sample image
    sample_stimulus = visual.ImageStim(window, image=sample_image_path)
    # project sample image on the back-screen 
    sample_stimulus.draw()
    
	# start gaze recording 
    el_tracker = start_gaze_recording(el_tracker) 
    # make the back-screen the front-screen  
    window.flip() 
    # time image presentation 
    stimulus_time = core.Clock()

    time_stamp = [] 
    gaze_current = [] 

    # record eye movements during stimulus presentation     
    if params['sample_observationtime'] == 'self_paced': 
		
        key_press = False
        while not key_press: 
                   
            # wait for responce before moving on
            keyboard_response = event.waitKeys()[0]
            
            # allow participants to exit experiments at the end of each trial 
            if keyboard_response in params['escape_keys']: 
                core.quit()
 		    
            # move on 	
            kep_press = True 
    else: 

        if params['sample_observationtime'] == 'variable': 
            # determine random presentation time between given intervals 
            i_time = np.random.uniform(params['sampletime'][0], params['sampletime'][1])
        elif params['sample_observationtime'] == 'fixed': 
            # extract given timing for all trials 
            i_time = params['sampletime'][0] 

        # wait for alotted time
        while stimulus_time.getTime() < i_time: pass 
	
    # measure actual time required for all observation types 
    trial_info['stimulus_presentation_time'] = stimulus_time.getTime()
    trial_info['gaze_positions'] = gaze_current 
    trial_info['time_stamp'] = time_stamp    

    # stop eye tracker 
    stop_gaze_recording(el_tracker) 
   
    ##### masking protocol
    if params['use_mask']: 
        generate_mask(window, sample_image_path, params['masktime']) 
    
    return trial_info 

def feedback_protocol(window, params, response):
    
    if params['feedback']: 
        # determine color of trial feedback 
        feedback_color = [params['wrong_rgb'], params['right_rgb']][  response ] 
        # determine trial text 
        feedback_text =  ['incorrect!', 'correct!'][ response ]
        # create feedback text/color
        trial_feedback = visual.TextStim(window, feedback_text, color=feedback_color)
        # draw on back window
        trial_feedback.draw() 
        # show back window
        window.flip() 
        # wait for given amount of time, depending on correct/incorrect
        core.wait([params['wrongtime'], params['righttime']][response])

def match_screen_protocol(window, el_tracker, params, trial_info): 

    # setup--don't show yet--match screen in preparation for data collection  
    window, trial_info = setup_match_screen(window, params, trial_info) 
 
    # start gaze recording
    el_tracker = start_gaze_recording(el_tracker) 
    # show the match screen which is prepped 
    window.flip()
    # start recording response time info 
    response_timeinfo = core.Clock()
    
    # wait for keyboard responses for allowed keys
    trial_response = None
   
    eye_used = el_tracker.eyeAvailable() 
    gaze_pos = (None, None) 
    gaze_x = [] 
    gaze_y = [] 
    time_i = [] 

    while trial_response == None: 

        current_sample = el_tracker.getNewestSample() 
        #dt = el_tracker.getNewestSample()
        if current_sample is None:  # no sample data
            gaze_pos = (None, None)
        else:
            if eye_used == 1 and current_sample.isRightSample():
                print('IS RIGHT')
                gaze_pos = current_sample.getRightEye().getGaze()
            elif eye_used == 0 and current_sample.isLeftSample():
                print('IS LEFT') 
                gaze_pos = current_sample.getLeftEye().getGaze()
			
            print( gaze_pos ) 
            # update the window position and redraw the screen
            gaze_window_pos = (int(gaze_pos[0]-params['screen_width']/2.0),
                               int(params['screen_height'] /2.0-gaze_pos[1]))

            gaze_x.append( int( gaze_window_pos[0] ))
            gaze_y.append( int( gaze_window_pos[1] )) 
            time_i.append( response_timeinfo.getTime() )
            print( type( gaze_pos[0] ) )
  			
        # wait for response 
        keyboard_response = event.getKeys() 
        if len(keyboard_response): 
            if keyboard_response[0] in trial_info['keyboard_map']:
            
                # convert keyboard response into experimental decision 
                participant_decision = trial_info['keyboard_map'][keyboard_response[0]] 
                # determine whether the participant was correct/incorrect
                trial_response = 1 * (trial_info['answer'] == participant_decision )
                # give feedback when specified  
                feedback_protocol(window, params, trial_response) 
        
            # allow participants to exit experiments at the end of each trial 
            elif keyboard_response[0] in ['q', 'escape']: 
                core.quit()
   
    trial_info['gaze_x'] = gaze_x 
    trial_info['gaze_y'] = gaze_y 
    trial_info['time_i'] = time_i


    # save decision 
    trial_info['participant_decision'] = participant_decision
    # save correct/incorrect 
    trial_info['correct'] = trial_response
    # save rt 
    trial_info['reaction_time'] = response_timeinfo.getTime() 
    
    # clear the buffer of everything 
    event.clearEvents()
    stop_gaze_recording(el_tracker)     
    
    return trial_info 

def run_single_trial(window, genv, sample_image, params): 
  
    # initialise trial info to save 
    trial_info  = {'sample_image': sample_image} 
    
    # prep eyetracker for trial  
    el_tracker = pre_trial_setup(window, genv, params)

    # show sample screen and collect gaze data 
    trial_info = sample_screen_protocol(window, el_tracker, params, trial_info)
    
    # collect responses on match screen 
    trial_info = match_screen_protocol(window, el_tracker, params, trial_info)   
    
    # migrate all the parameter information over to the trial data
    for i_param in params: trial_info[i_param] = params[i_param]
    
    if params['verbose']: print('\n\nDATA\n', trial_info) 
    
    return trial_info 

def eyetracker_setup_for_trial(win, genv, params): 

    scn_width = params['screen_width']
    scn_height = params['screen_height']

    # get a reference to the currently active EyeLink connection
    el_tracker = pylink.getEYELINK()

    # put the tracker in the offline mode first
    el_tracker.setOfflineMode()
    
    ######el_tracker.sendMessage('TRIALID %d' % trial_index)

    # terminate the task if no longer connected to the tracker or
    if (not el_tracker.isConnected()) or el_tracker.breakPressed():
        eyelink_functions.terminate_task(win, genv, params)
        return pylink.ABORT_EXPT
    # drift-check and re-do camera setup if ESCAPE is pressed
    try:
        error = el_tracker.doDriftCorrect(int(scn_width/2.0), int(scn_height/2.0), 1, 1)
        # break following a success drift-check
        if error is not pylink.ESC_KEY:
            pass
    except:
        print('failed to drift correct') 

    # put tracker in idle/offline mode before recording
    el_tracker.setOfflineMode()

    return el_tracker


def start_gaze_recording(el_tracker): 

    # start recording
    try:
        el_tracker.startRecording(1, 1, 1, 1)
    except RuntimeError as error:
        print("ERROR:", error)
        eyelink_functions.abort_trial()
        return pylink.TRIAL_ERROR

    # Allocate some time for the tracker to cache some samples
    pylink.pumpDelay(100)
	
    return el_tracker

def stop_gaze_recording(el_tracker): 

    # stop recording; add 100 msec to catch final events before stopping
    pylink.pumpDelay(100)
    el_tracker.stopRecording()

    # Viewer User Manual, "Protocol for EyeLink Data to Viewer Integration"
    el_tracker.sendMessage('TRIAL_RESULT %d' % pylink.TRIAL_OK)


def generate_subject_id(path_to_data, subject_id=None): 
    """generate id used to save data — build it out after talking with Akshay"""
    
    # get a list of previous subjects 
    past_subjects = np.unique( [i[7:10] for i in os.listdir(path_to_data) if 'subject' in i]  )

    # check for command line arguments
    if len(sys.argv) > 2: 
        
        # if arg can be converted into a number
        try: 
            # nice spacing 
            possible_id = '%03d'%(int(sys.argv[2]))
            # check if it's unique
            if possible_id not in past_subjects: 
                # define new subject_id
                subject_id = possible_id
        # otherwise, just use it as a string 
        except: 
            subject_id = sys.argv[2] 
    
    # if the subject_id is still not defined
    if subject_id == None: 
        # generate the next subject id in the folder
        subject_id = '%03d'%(len(past_subjects))
    
    return 'subject%s_%s'%(subject_id, datetime.today().strftime("%d_%m_%Y"))

def image_order_protocol(params): 
    """determine the order that images will be presented in"""
    
    if params['sample_image_protocol'] == 'shuffle': 
        # for the moment, shuffle experimmental images
        files = [i for i in os.listdir(params['image_directory']) if 'view' in i]
        images = np.random.permutation(files)
        
    return images

def eyetracker_protocols(i_protocol, params): 
    """need to define all the eye-tracking protocols for eyelink + tobii"""
    
    if i_protocol == 'calibration': 
        # initial calibration in experiment
        pass 

    elif i_protocol == 'recalibration': 
        # recalibrate when necessary throughout experiment
        pass
    
    elif i_protocol == 'validate': 
        # make sure we're still calibrated at the beginning of each trial
        pass 
    
    elif i_protocol == 'log_info': 
        # pass information to itracker 
        pass 

    return None 


def setup_eyelink_for_experiment(params): 

    # Switch to the script folder
    script_path = os.path.dirname(sys.argv[0])
    if len(script_path) != 0:
        os.chdir(script_path)

    params = eyelink_functions.setup_edf_file(params)

    el_tracker = eyelink_functions.connect_to_eyelink(params)
	
    params = eyelink_functions.open_edf_file(params, el_tracker) 
	
    eyelink_functions.configure_tracker(el_tracker, params) 

    win, genv, params = eyelink_functions.setup_graphics_environment_for_calibration(el_tracker, params)

    eyelink_functions.setup_calibration_target(genv, params)

    ###################### Step 5: Set up the camera and calibrate the tracker

    # Show the task instructions
    task_msg = 'In the task, you may press the SPACEBAR to end a trial\n' + \
        '\nPress Ctrl-C to if you need to quit the task early\n'
    if params['dummy_mode']:
        task_msg = task_msg + '\nNow, press ENTER to start the task'
    else:
        task_msg = task_msg + '\nNow, press ENTER twice to calibrate tracker'
    eyelink_functions.show_msg(params, win, genv, task_msg)

    # skip this step if running the script in Dummy Mode
    if not params['dummy_mode']:
        try:
            el_tracker.doTrackerSetup()
        except RuntimeError as err:
            print('ERROR:', err)
            el_tracker.exitCalibration()
    
    print('eyetracker sucessfully setup!') 

    return win, genv, params, el_tracker

def setup_camera_and_calibrate(win, el_tracker, params): 

    # Step 5: Set up the camera and calibrate the tracker

    # Show the task instructions
    task_msg = 'In the task, you may press the SPACEBAR to end a trial\n' + \
        '\nPress Ctrl-C to if you need to quit the task early\n'
    if params['dummy_mode']:
        task_msg = task_msg + '\nNow, press ENTER to start the task'
    else:
        task_msg = task_msg + '\nNow, press ENTER twice to calibrate tracker'
    eyelink_functions.show_msg(params, win, genv, task_msg)

    # skip this step if running the script in Dummy Mode
    if not params['dummy_mode']:
        try:
            el_tracker.doTrackerSetup()
        except RuntimeError as err:
            print('ERROR:', err)
            el_tracker.exitCalibration()


if __name__ == '__main__': 
    
    params = {
        # how to generate sample images
        'sample_image_protocol': 'shuffle', 
        # how to generate the distractor
        'distance_protocol': 'uniform',
        # keys to escape the experiment
        'escape_keys': ['q', 'escape'],
        # show sample for ... 'self_paced' 'variable' 'fixed'
        'sample_observationtime': 'fixed',  
        # time on sample screen if false—list w 1|2 numbers 
        'sampletime': [.2, 1] , 
        # entering into fullscreen 
        'full_screen': True, 
        # ratio of same/different 
        'proportion_same': .5, 
        # experiment type: 2|1 ('double'|'single') images on match screen
        'match_screen_type': 'double',
        # absolute path to images, which should be in this directory
        'image_directory': os.path.join(os.getcwd(),'images'),  
        # backwards mask over image 
        'use_mask': True, 
        # time to mask in seconds 
        'masktime': .02,
        # feedback after each trial
        'feedback': True, 
        # color of wrong trials feedback
        'wrong_rgb': (1,0,0), 
        # color of right trials feedback
        'right_rgb': (0,1,0), 
        # time to wait when wrong
        'wrongtime': 1, 
        # time to wait when right
        'righttime':.5,
        # print out data from the terminal 
		'verbose': True,
        # eyelink integration params
        'use_retina': False, 
        # decide whether we're actually running eyetracker 
        'dummy_mode': False,
        'fixation_image_location':  os.path.join(os.getcwd(),'images'),  
		}
    

    # generate a subject id we can use to save data from this experiment
    subject_id = generate_subject_id(os.getcwd()) 
   
    # HEAVY LIFTING
    experiment_window, genv, params, el_tracker = setup_eyelink_for_experiment(params) 	
    
    # determine how sample images will be ordered
    images = image_order_protocol(params) 
    
    # create dataframe for all trials in experiment 
    experiment_data = pandas.DataFrame({}) 
    
    # iterate across all images/objects
    for i_image in images[:2]: 
 
        # create single trial, evaluate performance, return trial data 
        trial_data = run_single_trial(experiment_window, genv, i_image, params)
        
        # aggregate data across trials 
        experiment_data = experiment_data.append(trial_data, ignore_index=True) 
        # for each trial, save cumulative data collected within experiment 
        experiment_data.to_csv('%s.csv'%subject_id)  
        # print to terminal 
        if params['verbose']: print('...data saved for %s'%subject_id)
   
    # begin termination protocols 
    eyelink_functions.terminate_task(experiment_window, genv, params) 
    # close experiment window 
    experiment_window.close()
    # close psychopy 
    core.quit()
