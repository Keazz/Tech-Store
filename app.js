// DOM elements
const loanBtn = document.getElementById("loan-btn")
const bankBalance = document.getElementById("bank-balance")
const currentDebt = document.getElementById("debt")
const displayDebt = document.getElementById("display-debt")

const workBtn = document.getElementById("work-btn")
const currentWorkBalance = document.getElementById("work-balance")
const deppositBtn = document.getElementById("depposit-btn")
const repayLoanBtn = document.getElementById("repay-loan-btn")

const laptopSelector = document.getElementById("laptop-selector")
const featureList = document.getElementById("feature-list")
const computerImg = document.getElementById("computer-img")

const productName = document.getElementById("product-name")
const productDescription = document.getElementById("product-description")
const productPrice = document.getElementById("product-price")
const buyNowBtn = document.getElementById("buy-now-btn")

// Global variables
const computerDataApiUrl = "https://screeching-lopsided-canidae.glitch.me/computers"
const computerImageUrl = "https://cdn.glitch.global/638b3c0b-25db-4de8-bb86-38ead3289b23/"
let computers = []

let accountBalance = 0
let workBalance = 0
let debt = 0
let outstandingLoan = false

// Event listeners
loanBtn.addEventListener("click", getLoan)
workBtn.addEventListener("click", goToWork)
deppositBtn.addEventListener("click", deppositToBank)
repayLoanBtn.addEventListener("click", repayLoan)
laptopSelector.addEventListener("change", updateStore)
buyNowBtn.addEventListener("click", buyPc)


// Event handlers
function buyPc() {
   let currentPc = computers[laptopSelector.selectedIndex]
   console.log("you bought the pc")
   if (accountBalance >= currentPc.price) {
      accountBalance -= currentPc.price
      updateAccountBalance()
      alert(`You are now the proud owner of the ${currentPc.title}`)
   } else {
      alert(`You can not afford the ${currentPc.title}`)
   }
}

function updateStore() {
   populateFeatureList()
   pcShowcase()
}

function repayLoan () {
   if (workBalance >= debt) {
      workBalance -= debt
      accountBalance += workBalance
      workBalance = 0
      debt = 0
      outstandingLoan = false

      updateAccountBalance()
   } else {
      debt -= workBalance
      workBalance = 0
      updateAccountBalance()
   }
}

function deppositToBank () {
   if (outstandingLoan){
      let wageDeduction = workBalance * 0.1
      workBalance -= wageDeduction
      
      if (debt - wageDeduction <= 0) {
         workBalance += wageDeduction - debt
         accountBalance += workBalance
         workBalance = 0
         debt = 0
         outstandingLoan = false
         updateAccountBalance()
      }  else {
         accountBalance += workBalance
         workBalance = 0
         debt -= wageDeduction
         updateAccountBalance()
      }
   } else {
      accountBalance += workBalance
      workBalance = 0
      updateAccountBalance()
   }
}

function goToWork() {
   workBalance += 100
   updateAccountBalance()
}

function getLoan() {

   if (outstandingLoan === false) { //checking if they allready have outstanding loan
      let loanAmount = Number(prompt("Enter loan amount."))

      if (loanAmount <= (accountBalance * 2) && loanAmount > 0) { //limiting loan to 10% of bank funds.
         accountBalance += loanAmount
         debt += loanAmount
         outstandingLoan = true
         updateAccountBalance()
      } else {
         confirm("Loan amount can not be more than 2x of your bank balance.")
      }

   } else {
      confirm("Cant get a new loan before current one is payed off.")
   }
}

// Functions

async function fetchComputerData() {
   const responce = await fetch(computerDataApiUrl)
   computers = await responce.json()

   for (c of computers) {
      let option = document.createElement("option")
      option.value = c.id
      option.innerHTML = c.title

      laptopSelector.append(option)
   }
   populateFeatureList()
   pcShowcase()
}

function populateFeatureList() {
   let currentPc = computers[laptopSelector.selectedIndex]
   featureList.innerHTML = ""
   for (s of currentPc.specs ){
      let spec = document.createElement("li")
      spec.innerHTML = s

      featureList.append(spec)
   }
}

function pcShowcase() {
   let currentPc = computers[laptopSelector.selectedIndex]
   productName.innerText = currentPc.title
   productDescription.innerText = currentPc.description
   productPrice.innerText = new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(currentPc.price,)
   computerImg.src = computerImageUrl + computers[laptopSelector.selectedIndex].image
}

 function updateAccountBalance() {
    bankBalance.innerText = new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(accountBalance,)
    currentDebt.innerText = new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(debt,)
    currentWorkBalance.innerText = new Intl.NumberFormat("no-NO", { style: "currency", currency: "NOK" }).format(workBalance,)
   loanDisplay()
 }

 function loanDisplay() { //to show and hide things releated to loan/debt
   if (outstandingLoan) {
      displayDebt.style.display = 'block' //show how much debt you have
      repayLoanBtn.style.display = 'block'
   } else {
      displayDebt.style.display = 'none' //hide debt display
      repayLoanBtn.style.display = 'none'
   }
 }
// Runtime
loanDisplay()
fetchComputerData()