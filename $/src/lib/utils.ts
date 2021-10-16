// #


import { base } from "$app/paths";

import { browser } from "$app/env";

async function importScript(url: string): Promise<void> {
	return new Promise<void>((resolve: () => void) => {
		let el = document.createElement("script");
		el.src = url;
		el.addEventListener("load", resolve);
		document.head.append(el);
	});
};

export async function sleep(ms: number): Promise<void> {
	return new Promise((resolve: () => void) => {
		globalThis.setTimeout(resolve, ms);
	});
};

export function toStyleStr(obj: { [key: string]: (string | number) }) {
	return (
		Object.entries(obj)
			.map(([key, val]) => `${key}:${val}`)
			.join(";")
	);
};


export function toMessageComment(messageArray: string[]): string {
	const maxLength: number = Math.max(
		...messageArray.map((val) => val.length)
	);
	const border: string = `${"#".repeat(maxLength + 10)}\n`;
	const innerMessageArray: string[] = messageArray.map(
		(val: string) =>
			`##   ${val}${" ".repeat(maxLength - val.length)}   ##\n`
	);

	return border + innerMessageArray.join("") + border;
};

export function toViewportStr(obj: { [key: string]: (string | number) }): string {
	return Object.entries(obj)
		.map(([key, val]) => `${key}=${val}`)
		.join(",");
};

function downloadFile(blob: Blob, fileName: string): void {
	let link = document.createElement("a");
	link.download = fileName;
	link.href = URL.createObjectURL(blob);

	link.click();

	URL.revokeObjectURL(link.href);
	return;
};

let fileScriptsImportet = false;

export async function zipFiles(): Promise<void> {

	if (!fileScriptsImportet) {
		await Promise.all([
			"/jszip.min.js",
			"/jszip-utils.min.js",
		].map(importScript));

		fileScriptsImportet = true;
	}

	let zip = new JSZip();

	const sources: string[] = (
		await (await window.fetch("./_/sourcemap.js.map")).json()
	).sources;

	let filePromises: Promise<void>[] = [];

	for await (let path of sources) {
		const absPath = path.replace(/^\.\.\//, `${base}/`);

		const filePath = ((): (string | false) => {
			if (path.startsWith("../")) {
				return path.replace(/^\.\.\//, "");
			}

			return false;
		})();

		if (filePath) {
			filePromises.push((async (): Promise<void> => {
				// @ts-ignore
				zip.file(filePath, await JSZipUtils.getBinaryContent(absPath));
			})());
		}
	}

	await Promise.all(filePromises);

	downloadFile(
		await zip.generateAsync({ type: "blob" }),
		`${location.host} - ${base.split("/").pop()}.zip`,
	);

	return;
};

function setColorTheme(theme: 0 | 1 | 2) {
	const themeName = (() => {
		switch (theme) {
			case (0): return "black";
			case (1): return "dark";
			case (2): return "light";
		}
	})();

	document.documentElement.style["colorScheme"] = (themeName === "light") ? "light" : "dark";

	for (const type of ["bg", "fg", "hover", "active"]) {
		document.documentElement.style.setProperty(`--scrollbar-${type}`, ` var(--scrollbar-${type}-${themeName})`);
	}
};

export const colorTheme = {
	store() {
		window.setTimeout(() => {
			const theme = (+document.querySelector<HTMLInputElement>("input[type=radio][name=theme-toggle]:checked")?.id?.match(/\d/)?.[0]) as (0 | 1 | 2);

			localStorage.setItem("colorTheme", JSON.stringify(theme));

			setColorTheme(theme);
		});
	},
	setInitial() {
		// document.body.classList.add("no-transition");

		const theme = (JSON.parse(localStorage.getItem("colorTheme")) as (0 | 1 | 2)) ?? 1;

		document.querySelector<HTMLInputElement>(`input[type=radio][name=theme-toggle]#theme-${theme}`)?.click();

		setColorTheme(theme);

		function recursiveFrameRequest(depth: number) {
			if (depth <= 0) {
				document.body.classList.remove("no-transition");
				return;
			}
			window.requestAnimationFrame(() => recursiveFrameRequest(depth - 1));
		}

		recursiveFrameRequest(5);
	},
};


// let aaaa = (() => {
// 	class asdf {
// 		private aaaa: string;
// 		constructor() {
// 			this.aaaa = "bbbb";
// 		}
// 	}

// 	return new asdf();
// })();
// // firebase:

// console.log(aaaa);

import {
	FirebaseApp,
	initializeApp,
} from "firebase/app";

import {
	getDatabase,
	ref as dbRef,
	set as dbSet,
	onValue as dbOnValue,
	Database,
} from "firebase/database";

export const firebase = new (class {
	private app: FirebaseApp;
	constructor() { };
	public async init() {
		this.app = initializeApp(
			await (await window.fetch("/__/firebase/init.json")).json(),
		);
		this.database = getDatabase(this.app);
	};
	public database: Database;
	public ref = dbRef;
	public onValue = dbOnValue;
})();


// new URL(location.href).searchParams.append
// new URL(location.href).searchParams.delete
// new URL(location.href).searchParams.forEach
// new URL(location.href).searchParams.get
// new URL(location.href).searchParams.getAll
// new URL(location.href).searchParams.has
// new URL(location.href).searchParams.set
// new URL(location.href).searchParams.sort
// new URL(location.href).searchParams.toString