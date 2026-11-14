
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");

const incomeDisplay = document.getElementById("total-income");
const expenseDisplay = document.getElementById("total-expenses");
const balanceDisplay = document.getElementById("balance");

const transactionList = document.getElementById("transaction-list");
const clearAllButton = document.getElementById("clear-all");

let transactions = [];

try {
    transactions = JSON.parse(
        localStorage.getItem("spendwiseTransactions")
    ) || [];
} catch (error) {
    transactions = [];
}

function saveTransactions() {
    localStorage.setItem(
        "spendwiseTransactions",
        JSON.stringify(transactions)
    );
}

function formatMoney(amount) {
    return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES"
    }).format(amount);
}

function updateSummary() {
    const income = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const expenses = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    const balance = income - expenses;

    incomeDisplay.textContent = formatMoney(income);
    expenseDisplay.textContent = formatMoney(expenses);
    balanceDisplay.textContent = formatMoney(balance);
}

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(transaction => {
        const row = document.createElement("tr");

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = transaction.description;

        const amountCell = document.createElement("td");
        amountCell.textContent = formatMoney(transaction.amount);

        const typeCell = document.createElement("td");
        typeCell.textContent = transaction.type;

        const dateCell = document.createElement("td");
        dateCell.textContent = transaction.date;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteTransaction(transaction.id);
        });

        actionCell.appendChild(deleteButton);

        row.append(
            descriptionCell,
            amountCell,
            typeCell,
            dateCell,
            actionCell
        );

        transactionList.appendChild(row);
    });
}

function addTransaction(event) {
    event.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!description || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid description and amount.");
        return;
    }

    if (!["income", "expense"].includes(type)) {
        alert("Please select a transaction type.");
        return;
    }

    const transaction = {
        id: Date.now() + Math.random(),
        description: description,
        amount: amount,
        type: type,
        date: new Date().toLocaleDateString("en-KE")
    };

    transactions.push(transaction);

    saveTransactions();
    displayTransactions();
    updateSummary();

    form.reset();
}

function deleteTransaction(id) {
    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    displayTransactions();
    updateSummary();
}

clearAllButton.addEventListener("click", () => {
    if (transactions.length === 0) {
        alert("There are no transactions to clear.");
        return;
    }

    if (confirm("Are you sure you want to delete all transactions?")) {
        transactions = [];

        saveTransactions();
        displayTransactions();
        updateSummary();
    }
});

form.addEventListener("submit", addTransaction);

// Display saved transactions when the website opens.
displayTransactions();
updateSummary();
