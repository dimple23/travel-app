const getTripInfo = async (url = '', data = {})=>{
  const response = await fetch(url, {
      method: 'POST', 
      credentials: 'same-origin',
      headers: {
      'Content-Type': 'application/json',
      }, 
      body: JSON.stringify(data),
  });
  try {
      const data = await response.json();
      return data;
  } catch(error) {
      console.log("error", error);
  }
}

export function handleSubmit(event) {
  event.preventDefault()

  let destination = document.getElementById('city').value
  let date = document.getElementById('departure').value;
  
  const re = new RegExp(/^(?!\s*$).+/);

  if (re.test(destination) && re.test(date)){
      const data = {
          city: destination,
          departure: date
      }
      // function to post request to the server
      getTripInfo('http://localhost:8088/trip', data)
      .then(function(res) {
          if (res.success == false){
              alert("ERROR ,please Check if input is correct")
          }
          // else update UI according to server response and data received from user
          else {
              Client.updateUI(res, data);
          }
      })
  }
  else {
      alert("ERROR! Please enter the Location & trip date")
  }
};
