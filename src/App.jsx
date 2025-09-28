import { useState } from 'react'
import Bulk from "./assets/Bulk.png";
import axios from "axios"
import * as XLSX from "xlsx"


function App() {
   const [msg, setMsg] = useState("")
   const [status, setStatus] = useState(false)
   const [emailList, setEmailList] = useState([])


   function handlemsg(event)
   {

    setMsg(event.target.value)
   }
   function handlefile(event){
     const file = event.target.files[0]
    
   const reader= new FileReader()

   reader.onload = function(event){
    const data = event.target.result
    const workbook = XLSX.read(data, { type: 'binary' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
    const totalemail = emailList.map(function(item){return item.A})
    console.log(totalemail);
    setEmailList(totalemail)
    
   }

   reader.readAsBinaryString(file)


   }

   function send(){

    setStatus(true)

    axios.post("https://bmail-back-api.onrender.com/sendbmail",{msg:msg , emailList:emailList})
    .then(function(data)
    {

      if(data.data === true)
        {
        alert("Email sent Successfully")
        setStatus(false)
      }
      else
        {
        alert("Failed")
      }
    })
    

   }



  return (
    <div className='h-screen relative overflow-hidden bg-cover bg-center '
    style={{ backgroundImage: `url(${Bulk})`}}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      

        <div  className="relative z-10 flex flex-col items-center w-full">
          <div className='bg-teal-500 text-white  text-center w-full'>
    <h1 className='text-2xl font-medium px-5 py-3'>BulkMail </h1>
    </div>

    <div className='bg-blue-950 text-white  text-center w-full'>
    <h1 className='text-xl font-medium px-5 py-3'>We can help your business with sending multiple emails at once</h1>
    </div>
    <div className='bg-teal-300 text-white w-full text-center'>
    <h1 className='text-lg font-medium px-5 py-3 '>Drag and Drop </h1>
    </div>

    <div className='bg-cyan-500 flex justify-center py-6 w-full text-black mt-20 px-5 '>
      <textarea onChange={handlemsg}  value={msg} className='w-[80%] h-32 py-2 outline-none px-2 text-center  border border-black rounded-md' placeholder='Enter your email text...'></textarea>
    </div>
    <div className='flex flex-col items-center'>

      <input onChange={handlefile} type='file' className='border-dashed py-4 px-4 mt-5 mb-5 border-4'/>
      
      <p className='text-white text-lg'>Total email in the file: {emailList.length}</p>


      <button onClick={send} className='bg-blue-900 py-2 px-7 mt-6  text-white font-semibold rounded-md w-fit hover:bg-blue-600'>{status?"Sending...":"Send"}</button>
    </div>
</div>
    </div>
  )
}

export default App
