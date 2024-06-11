import type { HistoryLine } from "../history/history-line.ts";

export interface AddOperationLinesContext {
	operations: Array<HistoryLine>;
	shouldHandleEndTurn: boolean;
}
