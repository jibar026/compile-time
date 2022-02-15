// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { privateEncrypt } from 'crypto';
import * as vscode from 'vscode';
import { ProgressLocation, window } from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate (context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// // This line of code will only be executed once when your extension is activated
	let store = context.globalState;
	if (store.get('interval.alert') === undefined){
		await setAlertInterval(store);
	}
	let userInterval = store.get('interval.alert') as number  * 60000 // convert to milliseconds

	if (store.get('interval.break') === undefined){
		await store.update('interval.break',15)
	}
	let breakTime = store.get('interval.break') as number * 60000 // convert to milliseconds

	setInterval(async () => {
		await createMessage(breakTime)
	}, (userInterval + breakTime));
	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let setAlert = vscode.commands.registerCommand('compiletime.set.interval.alert', () => setAlertInterval(store).then(()=>{
		userInterval = store.get('interval.alert') as number * 60000
	}));

	let setBreakTime = vscode.commands.registerCommand('compiletime.set.interval.break', () => setBreakInterval(store).then(()=>{
		breakTime = store.get('interval.break') as number * 60000
	}));

	context.subscriptions.push(setAlert);
	context.subscriptions.push(setBreakTime);
}

// this method is called when your extension is deactivated
export function deactivate() {}


async function setAlertInterval (store: vscode.Memento) {
	let interval = 50
	// The code you place here will be executed every time your command is executed
	let userInterval = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: 'Hi 👋 from Compile Time! How often(min) you want to take a break? ☕️',
	})

	if (userInterval !== undefined){
		interval =  userInterval as unknown as number
	}
	await store.update('interval.alert',interval)
	// await vscode.workspace.getConfiguration().update('conf.interval.alert',interval)
	await vscode.window.showInformationMessage('Yey! your break reminder ⏰ is now activated for every ' + interval +' min.');
}

async function setBreakInterval (store: vscode.Memento) {
	let interval = 5
	// The code you place here will be executed every time your command is executed
	let userInterval = await vscode.window.showInputBox({
		ignoreFocusOut: true,
		prompt: 'Hi 👋 from Compile Time! How long(min) your break will last? ☕️',
	})

	if (userInterval !== undefined){
		interval =  userInterval as unknown as number
	}
	await store.update('interval.break',interval)
	// await vscode.workspace.getConfiguration().update('conf.interval.alert',interval)
	await vscode.window.showInformationMessage('Yey! your break time ⏰ is now set for ' + interval +' min.');
}





function createMessage(breakTime:number){
	window.withProgress({
		location: ProgressLocation.Notification,
		title:'Break time ☕️: '+ generateMessage(),
		cancellable: true
	}, (progress, token) => {
		token.onCancellationRequested(() => {
			console.log("User canceled the long running operation");
		});

		progress.report({ increment: 0 });
		let percentage = 0
		var interval = setInterval(function() {

			percentage += 1;
			progress.report({ increment: 1});
		
			if (percentage >= 100) {
				clearInterval(interval);
			}
		}, (breakTime/100));

		return sleep(breakTime)
	});
}

function sleep(ms:number) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

  function generateMessage() {
	const messages = [
		"Time for a cofee ☕️ break?",
		"Drinking water helps maintain the balance of body fluids, so drink up!",
		"Water helps your kidneys, so remember to stay hydrated!",
		"Studies show that even mild dehydration can impair many aspects of brain function. Water break!",
		"Mild dehydration can impair mood, memory and brain performance. Stay hydrated!",
		"Sometimes we just need a mental vacation. Take a break and start planning your next vacation.",
		"The opportunity to step away from everything and take a break is something that shouldn't be squandered.",
		"You need to take a break away from your work area so when you return you are more refreshed and ready to work",
		"Remember you're machine that turns coffee into code",
		"Computers are fast; you can keep it slow.",
		"One mistake now is a hard to find bug later.",
		"There are two ways to write error-free programs; only the third works.",
		"If debugging is the process of removing bugs, then programming must be the process of putting them in.",
		"Remember that there is no code faster than no code.",
		"One man's crappy software is another man's full-time job.",
		"No code has zero defects.",
		"Deleted code is debugged code.",
		"It's not a bug — it's an undocumented feature.",
		"It works on your machine right?",
		"If it compiles... ship it.",
		"When you have no computer, you have no programming problems either.",
		"Don't solve problems that did not exist before.",
		"There is no Ctrl-Z in life.",
		"Whitespace is never white.",
		"When all else fails … reboot your laptop.",
		"That bug 🐛 can wait"
	];

	return messages[Math.floor(Math.random() * messages.length)];
}