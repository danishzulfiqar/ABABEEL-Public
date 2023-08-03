/* eslint-disable require-jsdoc */
/* eslint-disable eol-last */
/* eslint-disable no-undef */
/* eslint-disable quotes */
/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");
const puppeteer = require('puppeteer');


admin.initializeApp();

const accountSid = "";
const authToken = "";
const twilioClient = twilio(accountSid, authToken);

exports.sendSMS = functions.database
    .ref("/users/{userId}/User_Info")
    .onUpdate(async (change, context) => {
        const newStatus = change.after.val().crest.notify;
        const userId = context.params.userId;

        console.log(userId);

        if (newStatus === true) {
            try {
                const phoneNumber = change.after.val().crest.phone;

                if (phoneNumber) {
                    const firstName = change.after.val().crest.firstName;
                    const message = `Hi ${firstName}, Check your reports at https://ababeel.netlify.app`;

                    await twilioClient.messages.create({
                        body: message,
                        to: phoneNumber,
                        from: "",
                    });

                    console.log("SMS sent successfully to", phoneNumber);

                    // Update the notify status back to false
                    await admin.database().ref("/users/" + userId + "/User_Info/crest/notify").set(false);

                    console.log("Notify status set to false.");
                } else {
                    console.error("Phone number not found for user", userId);
                }
            } catch (error) {
                console.error("Error sending SMS:", error);
            }
        } else {
            // Status is false, do nothing or handle other cases
            console.log("Status is false, no SMS sent.");
        }
    });

exports.sendSMSForSensor = functions.database
    .ref("/users/{userId}/ConfigDevices/GroundSensors/{sensorId}")
    .onCreate(async (snapshot, context) => {
        try {
            const userId = context.params.userId;
            const phoneNumber = snapshot.val().phone;
            const firstName = snapshot.val().firstName;
            const message = `Hi ${firstName}, you got a new report. Check your reports at https://ababeel.netlify.app`;

            if (phoneNumber) {
                await twilioClient.messages.create({
                    body: message,
                    to: phoneNumber,
                    from: "+14849228589",
                });

                console.log("SMS sent successfully to", phoneNumber);
            } else {
                console.error("Phone number not found for user", userId);
            }
        } catch (error) {
            console.error("Error sending SMS:", error);
        }
        // eslint-disable-next-line eol-last
    });

async function scrapeCropName() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const apiUrl = "https://manhoosbilli1.pythonanywhere.com/predict?N=80&P=90&K=50&temperature=35.5&humidity=80&ph=6.4&rainfall=200";

        // Navigate to the API URL
        await page.goto(apiUrl);

        // Wait for the API response to load (you may need to adjust the wait time based on your API's response time)
        await page.waitForTimeout(5000);

        // Scrape the crop name from the API's response
        const recommendedCrop = await page.evaluate(() => {
            // Directly extract the recommended crop name text
            const data = JSON.parse(document.body.innerText.trim());
            return data.crop;
        });

        await browser.close();
        return recommendedCrop;
    } catch (error) {
        console.error('Error scraping crop name:', error);
        return null;
    }
}

exports.scrapeDataFromApi = functions.database
    .ref("/users/{userId}/User_Info/crest/recommend")
    .onUpdate(async (change, context) => {
        try {
            const newRecommend = change.after.val();
            const userId = context.params.userId;

            // Check if the recommend value has changed to true
            if (newRecommend === true) {
                const cropName = await scrapeCropName();

                // Save the "crop" value to the dataAnalysis/CropRecommended in the Firebase Realtime Database
                const databaseRef = admin.database().ref(`/users/${userId}/dataAnalysis/CropRecommended`);
                await databaseRef.set(cropName);

                // Log the "crop" value to the terminal
                console.log("Recommended crop for user", userId, ":", cropName);
            }
        } catch (error) {
            console.error("Error scraping data:", error);
        }
    });
