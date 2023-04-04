import axios from 'axios';
import {useState,useEffect} from 'react';
import '../styles/ChatGPT.css'
import Footer from './Footer';


let OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function ChatGPT() {

  const[bTextToSpeechSupported,setBTextToSpeechSupported] = useState(false);
  const[bSpeechInProgress,setBSpeechInProgress] = useState(false);
  const[oSpeechRecognizer,setOSpeechRecognizer] = useState({});
  const[oSpeechSynthesisUtterance,setOSpeechSynthesisUtterance] = useState();
  const[oVoices,setOVoices] = useState();
  const[voiceChosen,setVoiceChosen]=useState();
  const[smodel,setSmodel] = useState('text-davinci-003');
  const[input,setInput] = useState('');
  const[outputGPT,setOutputGPT] = useState("");

  const[darkMode,setDarkmode] = useState('Dark Mode')
  const[listenSpeech,setListenSpeech] = useState('Mute')

  const model_params={
    model:smodel,
    prompt:input,
    max_tokens:2048,
    temperature:0.5,
    user:"1",
    frequency_penalty:0.0,
    presence_penalty:0.0,
    stop:["#",";"]
  }

  useEffect(()=>{
    
    const btnBox = document.getElementById('mutebtnBox')

    if ("webkitSpeechRecognition" in window) {
      let SpeechRecognizer = new webkitSpeechRecognition();
      setOSpeechRecognizer(SpeechRecognizer)
      
    } else {
        //speech to text not supported
        btnBox.classList.add('hidden')
    }

    if ('speechSynthesis' in window) {

        setBTextToSpeechSupported(true);
        speechSynthesis.addEventListener("voiceschanged",()=>{
          const voices=window.speechSynthesis.getVoices();
          setOVoices(voices)
        })
    }

  },[voiceChosen,oVoices,listenSpeech])
  





function ChangeLang(e) {

  setOSpeechRecognizer(e)
}
function ChangeModel(e) {
  setSmodel(e)
  
}
function ChangeVoice(e) {
  setVoiceChosen(e)

}

function handleInput(e){
  setInput(e)
  
}

async function handleSubmit() {
  if (input == "" || (input.replace(/\s+/g, ''))=="") {
      alert("Type in your question!");
      inputBox.focus();
      return;
    }
    

  await axios.post("https://api.openai.com/v1/completions",model_params,{headers:
  {Authorization: "Bearer " + OPENAI_API_KEY}
  }).then((response)=>{
    setOutputGPT(input+": " +response.data.choices[0].text)
    }).catch(
      err=>console.log(err.response.data.error))
   
  setInput("")
}



function toggleDarkmode(e){
  const themeContainer = document.getElementById('themeContainer')
  if(e.target.checked ===true){
    setDarkmode('Dark Mode')
    themeContainer.classList.add('dark')
  }else{
    setDarkmode('Light Mode')
    themeContainer.classList.remove('dark')
  }

}
function toggleListenSpeech(e){
  const muteButton = document.getElementById('toggleMute')
  const voiceSelect = document.getElementById('voicesWrapper')
  if(e.target.checked ===true){
    
    voiceSelect.classList.remove('hidden')
    setListenSpeech('Listen')

    oSpeechRecognizer.start();
    oSpeechRecognizer.continuous = true;
    oSpeechRecognizer.interimResults = true;
    
    


    let oSpeechSynthesisUtterance = new SpeechSynthesisUtterance();
    setOSpeechSynthesisUtterance(oSpeechSynthesisUtterance)
    
    if(oVoices){
      if(voiceChosen !== "")
      oSpeechSynthesisUtterance.voice=oVoices[parseInt(voiceChosen)]
    }
    
    oSpeechSynthesisUtterance.addEventListener('end',()=>{
      if(oSpeechRecognizer){
        oSpeechRecognizer.start();
      }
    })

    if(oSpeechRecognizer && muteButton.checked){
      oSpeechRecognizer.stop();
    }

    oSpeechSynthesisUtterance.lang=voiceChosen;
    console.log(oSpeechSynthesisUtterance)
    window.speechSynthesis.speak(oSpeechSynthesisUtterance)
  }else{
    setListenSpeech('Mute')
    oSpeechRecognizer.stop();
    voiceSelect.classList.add('hidden')
  }

}


    return (
      <>
      <div id='themeContainer' className='dark'>
        <div className=" dark:bg-slate-800 bg-zinc-300 flex flex-col items-center dark:text-white text-sky-600 w-screen h-screen  p-5 px-12">
          <div className='flex w-full h-40 items-center justify-between'>
            <h2 className='text-5xl font-semibold'>Chat GPT</h2>
            <div className=" w-48 h-12 flex justify-evenly items-center  m-2">
              <input id="toggleDarkmode" type="checkbox" defaultChecked onClick={e=>toggleDarkmode(e)} className="cursor-pointer w-12 h-6 rounded-lg appearance-none bg-white border-2 checked:border-sky-400 checked:bg-gray-600 transition duration-200 relative"></input>
              <label htmlFor="toggleDarkmode" className="justify-center align-center text-lg font-semibold">{darkMode}</label> 
            </div>
          </div>
          <textarea type="text" id='output' className="w-full h-3/6 rounded-lg overflow-auto text-black p-3 " placeholder=" Chat GPT Output" value={outputGPT} readOnly />
          <div id="optionsContainer" className='flex w-11/12 justify-between items-center m-3'>
            <div className="flex justify-center space-x-2">
              <button type="submit" 
              data-te-ripple-init 
              data-te-ripple-color="light"
              onClick={handleSubmit} 
              className=' bg-gradient-to-r from-cyan-400 to-violet-600 rounded-lg  px-6 py-2.5 text-md text-white font-medium uppercase shadow-md hover:shadow-zinc-200 active:translate-y-0.5 active:shadow-green-500 transition duration-150 ease-in-out' >Generate</button>
            </div>
            <div id='mutebtnBox' className=''>
              <div className=" w-32 h-12 flex justify-evenly items-center">
                <input id="toggleMute" type="checkbox" onClick={e=>toggleListenSpeech(e)} className=" cursor-pointer w-10 h-6 rounded-full appearance-none bg-white border-2 checked:border-teal-400 checked:bg-gray-600 transition duration-200 relative"></input>
                <label htmlFor="chatSpeak" className="justify-center align-center text-lg font-semibold ">{listenSpeech}</label> 
              </div>
            </div>
            <div className="relative" data-te-dropdown-position="dropup">
              <select id='selModel' onChange={e=>ChangeModel(e.target.value)} className='bg-gray-50 m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 dark:bg-slate-600 dark:border-slate-700 dark:placeholder-bg-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                {/* <option selected>Completion model</option> */}
                <option value='text-davinci-003'>text-davinci-003</option>
                <option value='text-davinci-002'>text-davinci-002</option>
                <option value='code-davinci-002'>code-davinci-002</option>
              </select>
            </div>
            <div className="relative" data-te-dropdown-position="dropup">
              <select  id='selLang'  onChange={e=>ChangeLang(e.target.value)} className=' bg-gray-50 m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 dark:bg-slate-600 dark:border-slate-700 dark:placeholder-bg-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option value='en-US'>English (US)</option>
                <option value='fr-FR'>French</option>
                <option value='ru-RU'>Russian</option>
                <option value='pt-BR'>Portuguese (Brazil)</option>
                <option value='es-ES'>Spanish (Spain)</option>
                <option value='de-DE'>German</option>
                <option value='it-IT'>Italian</option>
                <option value='pl-PL'>Polish</option>
                <option value='nl-NL'>Dutch</option>
              </select>
            </div>
            <div id='voicesWrapper' className='hidden'>
              <select id='selVoices' onChange={e=>ChangeVoice(e.target.value)} className='text-black bg-gray-50 m-1 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-58 p-2 dark:bg-slate-600 dark:border-slate-700 dark:placeholder-bg-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                {oVoices ? oVoices.map(opt=> 
                (<option value={opt.voiceURI} className='text-white dark:text-white'>{opt.name}</option>)):""}
              </select>
            </div>

          </div>
          <textarea type="text" id='inputBox' onChange={e=>handleInput(e.target.value)} value={input} className="w-full h-32 rounded-lg text-black p-2 focus:ring-blue-500 focus:border-blue-500" placeholder=" Input Text"></textarea>
          <Footer></Footer>
        </div>
        </div>
      </>
    )
  }
  