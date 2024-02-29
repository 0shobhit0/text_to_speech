let speech = new SpeechSynthesisUtterance();
let voices = [];
let voiceSelect = document.querySelector("select");
let listenButton = document.getElementById("listen-button");
let downloadButton = document.getElementById("download-button");

window.speechSynthesis.onvoiceschanged = () =>{
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice,i)=>(voiceSelect.options[i]= new Option(voice.name, i)))
}
voiceSelect.addEventListener("change", () =>{
    speech.voice = voices[voiceSelect.value];
})

listenButton.addEventListener("click",()=>{
    let text = document.querySelector("textarea").value;
    speech.text = text;
    
    // Synthesizing speech
    let synth = window.speechSynthesis;
    synth.speak(speech);
    
    // Creating audio stream
    let audioStream = new SpeechSynthesisStream(synth, speech);
    
    // Creating a Blob from the audio stream
    audioStream.getAudioData().then(audioData => {
        let blob = new Blob([audioData], { type: 'audio/mpeg' }); // Specify the correct MIME type
        
        // Creating a temporary URL for the Blob
        let url = URL.createObjectURL(blob);
        
        // Setting download button properties
        downloadButton.href = url;
        downloadButton.download = 'audio.mp3';
        downloadButton.style.display = 'inline-block'; // Display the button
        
        // Revoking the URL object to release resources
        URL.revokeObjectURL(url);
    }).catch(error => {
        console.error('Error generating audio data:', error);
    });
})
