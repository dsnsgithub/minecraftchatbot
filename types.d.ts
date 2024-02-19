// types.d.ts
export interface PlayerDB {
	[IGN: string]: Player;
}

export interface Player {
	messages: string[];
	kills: number;
	deaths: number;
}

export interface Viewer {
	erase(id: string): void;
	drawBoxGrid(id: string, start: any, end: any, color?: string): void;
	drawLine(id: string, points: any[], color?: number): void;
	drawPoints(id: string, points: any[], color?: number, size?: number): void;
	close(): void;
}

export interface afk {
	start: () => Promise<void>;
	stop: () => Promise<void>;
	setOptions: (options?: afkOptions) => void;
	fish: () => Promise<void>;
	rotate: () => Promise<void>;
	walk: (dir: "forward" | "back" | "left" | "right") => Promise<void>;
	jump: () => Promise<void>;
	jumpWalk: () => Promise<void>;
	swingArm: () => Promise<void>;
	placeBlock: () => Promise<void>;
	breakBlock: () => Promise<void>;
	chat: () => Promise<void>;
	isFishing: boolean;
	config: afkOptions;
	enabled: boolean;
	killaura: {
		enabled: boolean;
		interval: any;
	};
}

interface afkOptions {
	actions?: afkAction[];
	fishing?: boolean;
	minWalkingTime?: number;
	maxWalkingTime?: number;
	minActionsInterval?: number;
	maxActionsInterval?: number;
	breaking?: number[];
	placing?: number[];
	chatting?: boolean;
	chatMessages?: string[];
	chatInterval?: number;
	killauraEnabled?: boolean;
	autoEatEnabled?: boolean;
	autoEatConfig?: any;
}

type afkAction = "rotate" | "walk" | "jump" | "jumpWalk" | "swingArm" | "placeBlock" | "breakBlock";
