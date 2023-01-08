import { Injectable } from "@angular/core";


@Injectable({providedIn: "root"})
export class StorageService {
    topic: string | null = null;
    dificulty: string | null = null;
    result: string | null = null;
}