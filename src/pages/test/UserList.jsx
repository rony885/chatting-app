{
    userList.map((item, i) => {
     // console.log(item);
     return (
      <div key={i}>
           <div  className="flex justify-between items-center mb-3 pb-3 border-b-2 border-blue-500" >
             <div className="flex gap-3 items-center">
               <div className="h-[65px] w-[65px] bg-orange-400 rounded-full overflow-hidden">
                 <ProfilePicture imgId={item.id} />
                 {/* <img className="w-full" src="" alt="" />   */}
               </div>
              <div>
                 <h2 className="font-semibold text-lg text-gray-500"> {item.username} </h2>
                 <h2 className="text-gray-500"> {item.email} </h2>
              </div>
             </div>
             <div>

               {
                 friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id) ?
                 <button className="button_v_3">Friend</button>
                 :
                 friendRequestList.includes(item.id+data.uid) || friendRequestList.includes(data.uid + item.id)
                 ?
                 // <div className="flex gap-2">
                 //   <button className="button_v_4">pending</button>
                 //   <button onClick={()=> userListRemove(item)} className="button_v_3">remove</button>
                 // </div>
                 <button className="button_v_3">Pending...</button>
                 : 
                 <button onClick={()=>handleFriendRequestSend(item)} className="button_v_3">Add Friend</button>
               }
                 
             </div>
          </div>
      </div>
     );
   })

   }