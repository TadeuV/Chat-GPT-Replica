import axios from 'axios';
import {useState,useEffect} from 'react';
import '../styles/ChatGPT.css'
import Footer from './Footer';
import {regeneratorRuntime} from 'regenerator-runtime'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';


let OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function ChatGPT() {

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

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();


  if (!browserSupportsSpeechRecognition) {
    const btnBox = document.getElementById('mutebtnBox')
    btnBox.classList.add('hidden')
    return <span>Browser doesn't support speech recognition.</span>;
  }

  
  useEffect(()=>{
    if(listening){
      setInput(transcript);
      document.getElementById('toggleMute').checked = true;
      setListenSpeech(' Listening')
    }
    if((document.getElementById('toggleMute').checked == true)&&(listening == false)){
      document.getElementById('toggleMute').checked = false;
      setListenSpeech('Mute');
    }
  })
 

function ToggleBurguerBtn() {
  
  const ToggleMenu = document.getElementById("burguermenu")
  const BurguerBTN = document.getElementById("mobile-menu-button")
  
 
  if(ToggleMenu.classList.contains('hidden') == true){
    ToggleMenu.classList.remove('hidden')
  }else{
    ToggleMenu.classList.add('hidden')
  }
  BurguerBTN.classList.toggle('mobile-menu-button')
}

function ChangeModel(e) {
  setSmodel(e)
  
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
  if(e.target.checked ===true){
    SpeechRecognition.startListening()

  }
  else{
    setListenSpeech('Mute')
    SpeechRecognition.stopListening();
  }

}

function handleReset(){
  resetTranscript();
  setOutputGPT('')
  setInput('')
}


    return (
      <>
      <div id='themeContainer' className='dark'>
        <div className=" dark:bg-slate-800 bg-gray-300 flex flex-col items-center dark:text-white text-sky-600 w-screen h-screen  p-5 px-12">
          <div className='flex w-full h-40 items-center justify-between'>
            <h2 className='text-5xl font-semibold'>Chat GPT</h2>
            <div className=" w-48 h-12 flex justify-evenly items-center  m-2">
              <input id="toggleDarkmode" type="checkbox" defaultChecked onClick={e=>toggleDarkmode(e)} className="cursor-pointer w-12 h-6 rounded-lg appearance-none bg-white border-2 checked:border-sky-400 checked:bg-gray-600 transition duration-200 relative"></input>
              <label htmlFor="toggleDarkmode" className="justify-center align-center text-lg font-semibold">{darkMode}</label> 
            </div>
          </div>
          <textarea type="text" id='output' className="shadow-inner shadow-gray-600 w-full h-3/6 rounded-lg overflow-auto text-black p-3 " placeholder=" Chat GPT Output" value={outputGPT} readOnly />
          <div id="optionsContainer" className='flex w-full  justify-between  items-center m-3 px-3  '>
            <div className='flex w-5/6 md:w-4/6 justify-between  md:justify-between items-center'>
              <div className="flex justify-center space-x-2 pr-2 md:pr-0">
                <button type="submit" 
                data-te-ripple-init 
                data-te-ripple-color="light"
                onClick={handleSubmit} 
                className=' bg-gradient-to-r from-cyan-400 to-violet-600 rounded-lg w-26 px-2 md:px-6 py-2 text-md text-white font-medium uppercase shadow-md hover:shadow-zinc-200 active:translate-y-0.5 active:shadow-green-500 transition duration-150 ease-in-out' >Generate</button>
              </div>
              <div id='mutebtnBox' className=''>
                <div className="w-24 md:w-36 h-14 flex justify-center md:justify-start items-center ">
                  <input id="toggleMute" type="checkbox" onClick={e=>toggleListenSpeech(e)} className=" cursor-pointer w-10 h-6 rounded-full appearance-none bg-white border-2 checked:border-red-400 checked:bg-gray-600 transition duration-200 relative"></input>
                  <label htmlFor="chatSpeak" className="pl-3 justify-start align-center text-lg font-semibold ">{listenSpeech}</label> 
                </div>
              </div>
              <div className="flex justify-center ">
                <button className='bg-gradient-to-r from-rose-400 to-fuchsia-600 rounded-lg w-16  md:w-20 h-10 text-md text-white font-medium uppercase' onClick={handleReset}>Reset</button>
              </div>
            </div>
            <button id="mobile-menu-button" onClick={ToggleBurguerBtn} className='flex lg:hidden items-center w-12 h-10 space-x-1 justify-evenly w-10  cursor-pointer active:translate-y-0.5'>
              <div className=' w-8 h-1 rounded absolute transition-all duration-300 bg-green-500
              before:content-[""]
              before:bg-green-500
              before:w-8 before:h-1
              before:rounded before:absolute
              before:transition-all
              before:duration-500
              before:-translate-y-2
              before:-translate-x-4
              before:transition-all before:duration-300
              after:content-[""]
              after:bg-green-500
              after:w-8 after:h-1
              after:rounded after:absolute
              after:transition-all
              after:duration-500
              after:translate-y-2
              after:-translate-x-4
              after:transition-all after:duration-300
              '></div>
            </button>
            <div id="burguermenu"  className='hidden shadow-lg shadow-blue-400  lg:shadow-none h-28 w-60 lg:h-14 lg:space-x-0 lg:flex lg:relative lg:w-1/5  justify-center lg:right-0 lg:bottom-0 absolute right-14 bottom-72 space-x-0.5 dark:bg-gray-800 bg-zinc-300 rounded-md p-1 transition-all duration-550 ease-in-out'>
           
              <a>
                <div className="relative" data-te-dropdown-position="dropup">
                  <select id='selModel' onChange={e=>ChangeModel(e.target.value)} className='bg-gray-50 m-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2 dark:bg-slate-600 dark:border-slate-700 dark:placeholder-bg-slate-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                    {/* <option selected>Completion model</option> */}
                    <option value='text-davinci-003'>text-davinci-003</option>
                    <option value='text-davinci-002'>text-davinci-002</option>
                    <option value='code-davinci-002'>code-davinci-002</option>
                  </select>
                </div>
              </a>
            </div>
            
          </div>
          <textarea type="text" id='inputBox' onChange={e=>handleInput(e.target.value)} value={input} className="shadow-inner shadow-gray-600 w-full h-32 rounded-lg text-black p-2 focus:ring-blue-500 focus:border-blue-500" placeholder=" Input Text"></textarea>
          <Footer></Footer>
        </div>
        </div>
      </>
    )
  }
  