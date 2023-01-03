export class Questions {
    responseCode: number
    public results: [ {
     catogory: string,
     correct_answer: string,
     difficulty: string,
     incorrect_answers: [string, string, string],
     question: string,
     type: string
    }
    ]

    constructor(results: [{catogory: string,
        correct_answer: string,
        difficulty: string,
        incorrect_answers: [string, string, string],
        question: string,
        type: string}]) {
        this.results = results;
    }
}