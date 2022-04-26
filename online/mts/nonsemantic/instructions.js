img_path = params['image_path']


instruction_pages = [
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
  ]
