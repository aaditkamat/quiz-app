var usernameForm = document.getElementById('username');
var uname = document.getElementById('uname');
var login = false; // not logged in
var theForm = document.getElementById('theForm');
var theQuiz = document.getElementById('theQuiz');
var pass = document.getElementById('pass');
var submitBtn = document.getElementById('submit');
var err = document.getElementById('err');
var errH = document.getElementById('errH');
var ctr = 0;


/*-----------------------------------*\
$ On Body Load
\*-----------------------------------*/
function chkUser() {
	// checking from localstorage if user provided name before...
	var tempName = localStorage.getItem('name'); // get the name
	if (tempName == null || tempName == '' || tempName == 'undefined') {
		// if name doesn't exist
		usernameForm.style.display = 'block'; // ask for name
		document.getElementById('logoutBtn').style.display = 'none'; // don't show logout button
	} else {
		var tempCa = localStorage.getItem('ca'); // get previous correct answer
		var tempPer = localStorage.getItem('percentage'); // get previous percentage
		if (
			(tempPer == null || tempPer == '' || tempPer == 'undefined') &&
			(tempCa == null || tempCa == '' || tempCa == 'undefined')
		) {
			theForm.style.display = 'block'; // show the form for password
			errH.innerHTML = tempName + ', Input Your Key Again.'; // display this text
			document.getElementById('logoutBtn').style.display = 'block'; // show logout button
		} else {
			// if percentage and correct answers found
			document.getElementById('theResult').style.display = 'block';
			showResult(tempPer, tempCa);
		}
	}
}

/*-----------------------------------*\
$ Asking for name...
\*-----------------------------------*/
function askPass() {
	// when user puts name and press enter
	if (uname.value == '' || uname.value == null || uname.value == 'undefined') {
		// if nothing is input, make name "BUDDY"..
		uname.value = 'Buddy';
		localStorage.setItem('name', uname.value); // place this name in local storage
		tempName = localStorage.getItem('name'); // get the name from local storage and put in a variable
	} else {
		localStorage.setItem('name', uname.value); // place this name in local storage
		tempName = localStorage.getItem('name'); // get the name from local storage and put in a variable
	}
	usernameForm.style.display = 'none'; // hide the current form or username
	theForm.style.display = 'block'; // show the form of password
	errH.innerHTML = tempName + ', Please Provide Your Key'; // display this line with user's name
}

/*-----------------------------------*\
$ The Login System...
\*-----------------------------------*/
function typing() {
	// enable 'verify identity btn' as user starts typing
	if (pass.value != '') {
		submitBtn.removeAttribute('disabled');
		document.getElementsByClassName('finger-print')[0].style.opacity = '1';
	} else {
		submitBtn.setAttribute('disabled', 'disabled');
		document.getElementsByClassName('finger-print')[0].style.opacity = '.6';
	}
}

function chkPass(btn) {
	// checking password
	if (pass.value == 11223344) {
		// if password is correct
		pass.setAttribute('disabled', 'disabled'); // make input box disabled - just for good UX
		submitBtn.setAttribute('disabled', 'disabled'); // make input box disabled - again just for good UX

		submitBtn.innerHTML =
			'<i class="material-icons loading" style="font-size: 1.8em;">cached</i>'; // show loading icon

		login = true; // set login true

		setTimeout(function() {
			// do processing for 2 second - just for good UX

			document.getElementsByClassName('finger-print')[0].style.display = 'none'; // hide lock icon
			document.getElementsByClassName('success')[0].style.display = 'block'; // show double tick
			document.getElementsByClassName('success')[0].style.opacity = '1';

			document.getElementsByClassName('passBox')[0].style.display = 'none'; // hide input box

			errH.innerHTML = 'Bingo!'; // in first line

			err.innerHTML = 'The password was <br> Correct!'; // in 2nd line
			err.style.color = '#28a745';

			btn.innerHTML = 'Start Quiz &gt;'; // replace text of input box to this
			btn.removeAttribute('disabled'); // make it enable again

			btn.classList.add('btn-success'); // change color of btn
			btn.setAttribute('onclick', 'startQuiz();'); // set attribue onclick="startQuiz();"
		}, 2000);
	} else if (pass.value == '') {
		// if in case someone puts empty pass

		document.getElementsByClassName('finger-print')[0].style.display = 'none';
		document.getElementsByClassName('warning')[0].style.display = 'block';
		document.getElementsByClassName('warning')[0].style.opacity = '1';

		errH.innerHTML = 'Errrr!';

		document.getElementsByClassName('passBox')[0].style.display = 'none';

		err.style.color = '#dc3545';
		err.innerHTML = "Password Can't Be Empty!";

		btn.innerHTML = 'Reload';
		btn.removeAttribute('disabled');

		btn.classList.add('btn-danger');
		btn.setAttribute('onclick', 'window.location.reload()');
	} else {
		// if wrong password
		pass.setAttribute('disabled', 'disabled');
		btn.setAttribute('disabled', 'disabled');

		btn.innerHTML =
			'<i class="material-icons loading" style="font-size: 1.8em;">cached</i>';

		setTimeout(function() {
			document.getElementsByClassName('finger-print')[0].style.display = 'none';
			document.getElementsByClassName('warning')[0].style.display = 'block';
			document.getElementsByClassName('warning')[0].style.opacity = '1';

			document.getElementsByClassName('passBox')[0].style.display = 'none';

			errH.innerHTML = 'Errrr!';

			err.style.color = '#dc3545';
			err.innerHTML = 'The password was <br> NOT Correct!';

			btn.innerHTML = 'Dismiss';
			btn.removeAttribute('disabled');

			btn.classList.add('btn-danger');
			btn.setAttribute('onclick', 'window.location.reload();');

			pass.removeAttribute('disabled');
			btn.removeAttribute('disabled');

			errH.classList.add('shake');
			err.classList.add('shake');
		}, 2000);
	}
}

function resetErr() {
	// reset all error to default (This is triggered when user focus on pass input box)
	pass.style.borderColor = '#007bff';
	pass.value = '';
	err.innerHTML = '';

	err.classList.remove('shake');
	pass.classList.remove('shake');

	document.getElementsByClassName('warning')[0].style.display = 'none';
	document.getElementsByClassName('finger-print')[0].style.display = 'block';
	document.getElementsByClassName('finger-print')[0].style.opacity = '.6';

	submitBtn.innerHTML = 'Confirm Identity';
	submitBtn.classList.remove('btn-danger');
	submitBtn.classList.add('btn-primary');
}

function startQuiz() {
	theForm.style.display = 'none'; // hide the password form
	theQuiz.style.display = 'block'; // show the quiz page
	generateQ(); // trigger first question
}

/*-----------------------------------*\
$ The Quiz Begins...
\*-----------------------------------*/
var queDone = 0; // question asked...
var userAns = []; // user's answers
var queDoneArr = []; // storing which question is asked

// showing steps (dots)...
steps(totQ.length); // craetes " <span class="step"></span> ";
function steps(quizLength) {
	var mainStepDiv = document.getElementById('steps');
	for (var i = 0; i < quizLength; i++) {
		var span = document.createElement('span');
		span.className = 'step';
		mainStepDiv.appendChild(span);
	}
}

var p = document.getElementById('text'); // the paragraph
var Q1 = document.getElementById('q1'); // question 01
var Q2 = document.getElementById('q2'); // question 02
var Q3 = document.getElementById('q3'); // question 03

// generates and places random questions...
function generateQ() {
	nextBtn.setAttribute('disabled', 'disabled');
	var thisAsked = false;
	while (totQ[ctr].asked === 0) {
		// if this question is not asked
		thisAsked = true; // this will be true
		totQ[ctr].asked = 1; // mark this as asked
		queDoneArr.unshift(ctr); // put in asked quesion array
		//console.log('QuesDone',queDoneArr);
		queDone = ++queDone; // increase the counter
		p.innerHTML = totQ[ctr].passage; // write passage
		Q1.innerHTML = totQ[ctr].questions[0]; // write question 1
		Q2.innerHTML = totQ[ctr].questions[1]; // write question 2
		Q3.innerHTML = totQ[ctr].questions[2]; // write question 3
	}
	ctr++;
}

function next() {
	// user clicks NEXT...
	topping(queDone); // setting up btn and steps counter...
	if (queDone == totQ.length) {
		// if reached the end of the questions
		theQuiz.style.display = 'none';
		document.getElementById('theResult').style.display = 'block';
		calcResult(); // calculates result
		// alert('Good Job! Calculating Result');
		return false;
	}
	generateQ();
}

var buttons = document.querySelectorAll('textarea.response'); // targetting all buttons

// enable btn if radio btn is checked
var nextBtn = document.getElementById('next-button');
function enableBtn(button) {
	nextBtn.removeAttribute('disabled');
	userAns.unshift(button.value);
	document.getElementsByClassName('step')[queDone - 1].className += ' finish';
}

function topping(n) {
	// dynamic next button's text
	if (n == totQ.length - 1)
		document.getElementById('next-button').innerHTML = 'Submit';
	else if (n == totQ.length) {
		document.getElementById('next-button').innerHTML = 'No Questions';
		nextBtn.setAttribute('disabled', 'disabled');
	} else document.getElementById('next-button').innerHTML = 'Next';
	fixStepIndicator(n); // it will display the correct step indicator
}

function fixStepIndicator(n) {
	// removes the "active" class of all steps...
	var i,
		x = document.getElementsByClassName('step');
	for (i = 0; i < x.length; i++) {
		x[i].className = x[i].className.replace(' active', '');
	}
	x[n - 1].className += ' active'; // and adds the "active" class on the current step
}

function calcResult() {
	// calculates result
	var ca = 0; // correct answer - currently ZerO..
	for (var i = 0; i < totQ.length; i++) {
		// loop till total num of questions
		var a = queDoneArr[i]; // getting done questions from array
		if (userAns[i] == totQ[a].answer) {
			// if user's answer matches with array's question's answer
			ca = ca + 1; // increase correct answers' counter
		}
	}
	var percentage = (ca / totQ.length) * 100; // calculates %
	// alert('Correct Answers: ' + ca + '\n' + 'Your Percentage is: ' + percentage);
	showResult(percentage, ca);
}

/*-----------------------------------*\
$ The Result Part...
\*-----------------------------------*/
var resultCircle = document.getElementById('resultCircle');
var resultFb = document.getElementById('resultFb');
var correctAns = document.getElementById('correctAns');
var quizCompleted = false;
var RColor;
function showResult(percentage, ca) {
	if (percentage == 100) {
		RColor = 'teal';
		resultFb.innerHTML = 'Wohoo.. Great, You are pass!';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 80) {
		RColor = 'green';
		resultFb.innerHTML = 'Congrats! You are pass.';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 65) {
		RColor = 'blue';
		resultFb.innerHTML = 'Good Effort, You are pass.';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else if (percentage >= 50) {
		RColor = 'orange';
		resultFb.innerHTML = 'You are passed!';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	} else {
		RColor = 'red';
		resultFb.innerHTML = 'Oh No! Your Are Failed... <br> Better Luck Next Time';
		correctAns.innerHTML = 'Correct Answers: ' + ca;
	}

	localStorage.setItem('percentage', percentage);
	localStorage.setItem('ca', ca);
	quizCompleted = true;

	var path =
		'<svg viewbox="0 0 36 36" class="circular-chart ' +
		RColor +
		'"> \
    <path class="circle-bg" \
    d="M18 2.0845 \
    a 15.9155 15.9155 0 0 1 0 31.831 \
    a 15.9155 15.9155 0 0 1 0 -31.831" \
    /> \
    <path class="circle" \
    stroke-dasharray="' +
		percentage +
		', 100" \
    d="M18 2.0845 \
    a 15.9155 15.9155 0 0 1 0 31.831 \
    a 15.9155 15.9155 0 0 1 0 -31.831" \
    /> \
    <text x="19" y="21" id="percentage">' +
		percentage +
		'%</text> \
    </svg>';
	resultCircle.innerHTML = path;
}

function logout() {
	// when logout button triggered
	localStorage.clear(); // clear all local storage
	location.reload(true); // hard reload the page
}

function retakeQuiz() {
	localStorage.removeItem('percentage');
	localStorage.removeItem('ca');
	location.reload(true); // hard reload the page
}
