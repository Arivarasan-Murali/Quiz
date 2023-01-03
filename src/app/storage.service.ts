import { Injectable } from "@angular/core";


@Injectable({providedIn: "root"})
export class StorageService {
    topic: number = 0;
    dificulty: string = 'easy';

    answers: [
        qNO: number,
        option: number
    ]
}