const express = require('express');
const bodyparser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const axios = require('axios').default;
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

require('dotenv').config();

app.use(bodyparser.json());

//swagger defination
const options = {
    swaggerDefinition: {
        info: {
            title: "Text translator Api",
            version: "1.0.1",
            description: "An AI service for real-time text translation, language detection and dictionary lookup.Translator is a cloud-based machine translation service and is part of the Azure Cognitive Services family of cognitive APIs used to build intelligent apps. It allows you to add multi-language user experiences in more than 70 languages.",
            contact: {
                "name": "Shreeya",
                "url": "http://www.shreeyagupta.com",
                "email": "shreeyag11@gmail.com"
            }
        },
        host: "198.199.86.6:" + port,
        basePath: "/",
    },
    apis: ["./translate.js"],
};

app.use(cors());

const specs = swaggerJsdoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

var subscriptionKey = process.env.API_KEY;
var endpoint = "https://api.cognitive.microsofttranslator.com/";
var location = "global";

/**
 * @swagger
 * definitions:
 *   Translation:
 *     properties:
 *       text:
 *         type: string
 *         example: Hello World!
 *       from:
 *         type: string
 *         example: en
 *       to:
 *         type: array
 *         items:
 *          type: string 
 *          example: es
 *       api_version:
 *         type: string
 *         example: '3.0'
 */
/** 
 * @swagger
 * /translate:
 *    post:
 *      description: Translate the text provided to a given language
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully translated to the language provided
 *          500:
 *              description: An error occured
 *          400:
 *              description: Bad Request
 *      parameters:
 *          - name: Translation
 *            description: Translation Object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Translation'
 *              
 */
app.post('/translate', (req, res) => {
    axios.request({
        url: endpoint + '/translate',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': req.body.api_version,
            'from': req.body.from,
            'to': req.body.to
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function (response) {
        res.status(200).send(response.data[0]["translations"]);
    }, (error) => {
        res.status(400).send(error);
    })
});

/**
 * @swagger
 * definitions:
 *   Detection:
 *     properties:
 *       text:
 *         type: string
 *         example: Hello!
 *       api_version:
 *         type: string
 *         example: '3.0'
 */
/** 
 * @swagger
 * /detect:
 *    post:
 *      description: If you know that you'll need translation, but don't know the language of the text that will be sent to the Translator service, you can use the language detection operation.
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully detected the language of the text
 *          500:
 *              description: An error occured
 *          400:
 *              description: Bad Request
 *      parameters:
 *          - name: Detection
 *            description: Detection Object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Detection'
 *              
 */
app.post('/detect', (req, res) => {
    axios.request({
        url: endpoint + '/detect',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': req.body.api_version
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function (response) {
        res.status(200).send(response.data);
    }, (error) => {
        res.status(400).send(error);
    })
})

/**
 * @swagger
 * definitions:
 *   Dictionary:
 *     properties:
 *       text:
 *         type: string
 *         example: shark
 *       from:
 *         type: string
 *         example: en
 *       to:
 *         type: array
 *         items:
 *          type: string 
 *          example: es
 *       api_version:
 *         type: string
 *         example: '3.0'
 */
/** 
 * @swagger
 * /dictionary:
 *    post:
 *      description: With the dictionary endpoint, you can get alternate translations for a word or phrase. For example, when translating the word "shark" from en to es, this endpoint returns both "tiburón" and "escualo".
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: Successfully translated to the language provided
 *          500:
 *              description: An error occured
 *          400:
 *              description: Bad Request
 *      parameters:
 *          - name: Dictionary
 *            description: Dictionary Object
 *            in: body
 *            required: true
 *            schema:
 *              $ref: '#/definitions/Dictionary'
 *              
 */
app.post('/dictionary', (req, res) => {
    axios({
        url: endpoint + '/dictionary/lookup',
        method: 'post',
        headers: {
            'Ocp-Apim-Subscription-Key': subscriptionKey,
            'Ocp-Apim-Subscription-Region': location,
            'Content-type': 'application/json',
            'X-ClientTraceId': uuidv4().toString()
        },
        params: {
            'api-version': req.body.api_version,
            'from': req.body.from,
            'to': req.body.to
        },
        data: [{
            'text': req.body.text
        }],
        responseType: 'json'
    }).then(function (response) {
        res.status(200).send(response.data);
    }, (error) => {
        res.status(400).send(error);
    })
})

app.listen(port, () => {
    console.log(`Listening at http://198.199.86.6:${port}`);
})

