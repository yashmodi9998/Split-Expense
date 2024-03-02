window.onload = pageLoad;

function pageLoad() {
  var formHandle = document.forms.splitForm;
  //array obj for members in a group
  var members = ["Yash Modi", "Sean Doyel", "Donald Trump"];
  //object for making a list of expenses made in a group
  const expenses = [
    {
      description: "Expense 1",
      amount: 30,
      payer: "Yash Modi",
      splitWith: ["Yash Modi", "Sean Doyel", "Donald Trump"],
    },
    {
      description: "Expense 2",
      amount: 15,
      payer: "Sean Doyel",
      splitWith: ["Yash Modi", "Sean Doyel"],
    },
  ];

  var expenseList = document.getElementById("expense-list");
  //CALL ExpenseDetails Function
  expenseDetails();

  //CALL addExpense Function
  addExpense();

  //This function is use to add expenses in a expenseList obj to be store in a list
  function expenseDetails() {
    expenseList.innerHTML = "";
    expenses.forEach((expense) => {
      var li = document.createElement("li");
      li.classList.add("expenselist");
      li.innerHTML =
        "<b>Description : </b>" +
        expense.description +
        "<br><b>Amount : </b>" +
        expense.amount +
        "<br><b>Paid By : </b> " +
        expense.payer +
        "<br><b>Split between : </b> " +
        expense.splitWith.join(", ");

      expenseList.appendChild(li);
    });
  }
  // This function is used to make a calculation based on money paid by and split between
  function addExpense() {
    var balance = {};

    // Set balance for each member as 0.
    members.forEach((groupMember) => {
      balance[groupMember] = 0;
    });

    // Calculate total amount for each member
    expenses.forEach((expense) => {
      //  payer's contributions separately
      var amountPerPerson = expense.amount / expense.splitWith.length;

      expense.splitWith.forEach((member) => {
        // Deduct the split amount from each participant (excluding the payer)
        if (member !== expense.payer) {
          // console.log("Member" + expense.splitWith);

          console.log(expense.payer + " : " + balance[expense.payer]);

          balance[member] -= amountPerPerson;
        }
      });

      // Add the entire expense amount to the payer's balance
      balance[expense.payer] += expense.amount - amountPerPerson;
    });

    var balanceList = document.getElementById("balance-list");
    balanceList.innerHTML = "";

    // For loop to create an element in a list where to check
    // each member's current status is owed or owes or settled up
    for (var member in balance) {
      var li = document.createElement("li");

      // to make amount looks like positive when is owed
      var owedAmount = Math.abs(balance[member]);

      // If amount is < 0 the person is owed with money;
      if (balance[member] < 0) {
        // classList to call the CSS for li element
        li.classList.add("owed");
        li.innerHTML = member + " owed " + owedAmount.toFixed(2) + " $.";
      }
      // If amount is == 0 the person has settled all the expenses
      else if (balance[member] === 0) {
        // classList to call the CSS for li element
        li.classList.add("settled");
        li.innerHTML = member + " has settled all expenses";
      } else {
        // classList to call the CSS for li element
        li.classList.add("owes");
        li.innerHTML = member + " owes " + balance[member].toFixed(2) + " $.";
      }
      // Add li element to the list
      balanceList.appendChild(li);
    }
  }

  //function processForm called on form submission
  formHandle.onsubmit = processForm;

  function processForm() {
    var description = formHandle.expense_description;
    var amount = formHandle.expense_amount;
    var payer = formHandle.expense_payer;
    var splitBetweenCheckboxes = formHandle.elements["splitbetween[]"];
    var ex_error = document.getElementById("ex_error");
    ex_error.innerHTML = "";
    // Validation for expense description
    if (description.value.trim() === "") {
      ex_error.innerHTML = "*Please Enter Valid Description";
      description.focus();
      return false;
    }

    // Validation for expense amount
    if (isNaN(amount.value) || amount.value <= 0) {
      ex_error.innerHTML = "*Please Enter Valid Amount";
      amount.focus();
      return false;
    }

    // Validation for payer selection
    if (payer.value === "0") {
      ex_error.innerHTML = "*Please Enter Payer";
      payer.focus();
      return false;
    }

    // Validation for at least one member selected for splitting
    var isMemberSelected = false;
    for (var i = 0; i < splitBetweenCheckboxes.length; i++) {
      if (splitBetweenCheckboxes[i].checked) {
        isMemberSelected = true;
        break;
      }
    }

    if (!isMemberSelected) {
      ex_error.innerHTML = "*Please select atleast one member to split expense";
      return false;
    }

    var selectedMembers = [];
    //use for loop to get list of all members ( checked on Checkbox )
    // who are sharing expense with
    for (var i = 0; i < splitBetweenCheckboxes.length; i++) {
      if (splitBetweenCheckboxes[i].checked) {
        selectedMembers.push(splitBetweenCheckboxes[i].value);
      }
    }
    //add form data into the expenses object
    expenses.push({
      description: description.value,
      amount: amount.value,
      payer: payer.value,
      splitWith: selectedMembers,
    });

    // console.log(expenses);
    //calls expenseDetails
    expenseDetails();
    //calls addExpenses
    addExpense();
    //after submittion form it resets form value
    document.getElementById("splitForm").reset();
    return false;
  }
}
