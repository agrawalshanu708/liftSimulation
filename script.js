const generateBtn = document.querySelector('#generate-btn')
const noOfFloor = document.querySelector('#no-of-floor')
const noOfLift = document.querySelector('#no-of-lift')
const frame = document.querySelector('.frame')

generateBtn.addEventListener('click', ()=> {
  
  const liftCount = Number(noOfFloor.value);
  const floorCount = Number(noOfLift.value);
  
  if(liftCount>=1 && floorCount>=2){
    frame.innerHTML = '';
    buildLifts(liftCount,floorCount)
  }else{
    alert('floor > 2 | lift > 1')
  }
})

const buildLifts = (liftCount,floorCount) => {
    
  const liftGroup = document.createElement('div')
  liftGroup.setAttribute('class', 'lift-grp')
  let floorArray = [];
  
  //generate-lift
  for(let i = 0;i<liftCount;i++){
  
  const lift = document.createElement('div')
  lift.setAttribute('class', 'lift')
  lift.setAttribute('data-floor', 1)
  lift.setAttribute('data-lift', i+1)
  liftGroup.appendChild(lift);   
}
//generatle-floor
  for(let i = 0;i<floorCount;i++){
   const floorContainer = document.createElement('div')
   const floor = document.createElement('div');
   const buttonBox = document.createElement('div')
   floorContainer.setAttribute('class', 'floor-container')
   buttonBox.setAttribute('class', 'btn-box')
   floor.setAttribute('class','floor')
   floor.setAttribute('data-floor', i+1)
    
   const callBtn = document.createElement('button')
   const floorNumber = document.createElement('h3')
   floorNumber.textContent = `Fl-${i+1}`
   callBtn.textContent = "Call"
   callBtn.setAttribute('class','cal-btn')
   callBtn.setAttribute('data-floor', i+1) 
   buttonBox.appendChild(callBtn)
   buttonBox.appendChild(floorNumber)
    
   floorContainer.appendChild(buttonBox)
   if(i === 0) floorContainer.append(liftGroup) 
   floor.appendChild(floorContainer)
    floorArray.unshift(floor)
} 
  for(let i =0;i<floorArray.length;i++){
    frame.appendChild(floorArray[i])
  } 
}

let prevCall;
document.addEventListener('click', (e) => {
 const floorCall = Number(e.target.dataset.floor)
 if(prevCall !== floorCall && floorCall){
   prevCall = floorCall;
   operationStart(floorCall)
 }
})

const operationStart = (floorCall) => {
  const lifts = Array.from(document.querySelectorAll('.lift')) 
  const nonBusyLift = lifts.filter(lift => !lift.classList.contains('busy'))
    let nearLift;
    let distance = null;

  if(nonBusyLift.length){
    for(i=0;i<nonBusyLift.length;i++){
     const floorDistance = Math.abs(floorCall - Number(nonBusyLift[i].dataset.floor))
     if(distance === null || floorDistance <= distance){
       distance = floorDistance;
       nearLift = nonBusyLift[i]
     } 
     }
       moveLift(floorCall,nearLift,distance)

  }else{
    setTimeout(() => {
         operationStart(floorCall)
    },1000)
  }
}

  
const moveLift = (floorCall,lift,distance) => {

  const liftOnFloor = Number(lift.dataset.floor);
  const { height } = document.querySelector(`[data-floor='${floorCall}']`).getBoundingClientRect();
  if(liftOnFloor !== floorCall) {
    lift.style.transform = `translateY(-${height * (floorCall - 1)}px)`;
    lift.style.transition = `all ${distance * 2}s ease-in`;
    lift.dataset.floor = floorCall;
    lift.classList.add("busy");
      
  //lift-reached  
  setTimeout(() => {  
  lift.classList.add('operation-door')
  },distance * 2000 + 500)

   //free the lift
    lift.addEventListener('transitionend', (e) => {
      setTimeout(() => {
        lift.classList.remove("operation-door");
          lift.classList.remove("busy");
    },5500)
    })
    
  } else {
    lift.classList.add("operation-door");
    lift.classList.add("busy");
    setTimeout(() => {
      lift.classList.remove("operation-door");
      lift.classList.remove("busy");
    }, 5500);
  }
}