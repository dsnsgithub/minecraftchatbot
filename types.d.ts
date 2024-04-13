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
