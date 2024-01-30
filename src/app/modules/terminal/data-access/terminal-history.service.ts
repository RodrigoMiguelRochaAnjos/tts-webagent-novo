import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";
import { DestroyService } from "src/app/core/services/destroy.service";
import { CircularLinkedList } from "src/app/core/utils/circular-linked-list.structure";

@Injectable({
    providedIn: 'root'
})
export class TerminalHistoryService {
    private history$: BehaviorSubject<CircularLinkedList<string>> = new BehaviorSubject<CircularLinkedList<string>>(new CircularLinkedList<string>(50));

    private forwardIterator!: Iterator<string>;
    private backwardsIterator!: Iterator<string>;

    constructor(
        private destroyService: DestroyService
    ) {
        const list: CircularLinkedList<string> = this.history$.value;
        list.append('');

        this.history$.next(list);

        this.loadCommandHistory();

        this.history$.subscribe((value: CircularLinkedList<string>) => {
            this.forwardIterator = value.forwardsIterator();
            this.backwardsIterator = value.backwardIterator();
        })
    }

    public getHistory(): Observable<CircularLinkedList<string>> {
        return this.history$.pipe(takeUntil(this.destroyService.getDestroyOrder()));
    }

    public addCommandToHistory(command: string): void {
        const commands: CircularLinkedList<string> = this.history$.value;

        if (command === this.backwardsIterator.next().value) return;

        commands.append(command);

        this.history$.next(commands);

        localStorage.setItem('commands', JSON.stringify(commands.toList()));
    }

    public loadCommandHistory(): void {
        const savedCommandsString = localStorage.getItem("commands");

        if (savedCommandsString == null) return;

        const commands: CircularLinkedList<string> = new CircularLinkedList<string>(50);

        for (let command of JSON.parse(savedCommandsString) as string[]) {
            commands.append(command);
        }

        this.history$.next(commands);
    }
}