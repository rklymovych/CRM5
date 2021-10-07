export const sendInitMessageWithMockPresentationData = () => {
    window.postMessage({
        status: "success",
        actionName: "init",
        response: {
            "oceSecuredConfig": {"cloudFrontURL": "http://localhost:4000"},
            "clmData": {
                "call": {"id": "0011m000007RWVPAA5", "name": "Call Name"},
                "account": {"id": "0011m000007RWVPAA4", "name": "AARON H MORITA"},
                "user": {
                    "employee_name": "USER NAME",
                    "employee_firstname": "USER FIRST NAME",
                    "employee_lastname": "USER LAST NAME"
                },
                // "clmViewerDataId": "a1z0p0000009vH9AAI",
                "settings": {
                    "trainingModeEnabled": false,
                    "showSequenceNames": false,
                    "mode": "remote",
                    "callURL": "https://ocedev3--qa5.lightning.force.com/lightning/_classic/%2Fa2I0p000000UibFEAS"
                },
                "labels": {
                    "Call": "Call",
                    "Cancel": "Cancel",
                    "End": "End",
                    "PresentationWillBeCanceled": "Presentation will be canceled and captured information will be lost. Are you sure you want to cancel?",
                    "EndSessionConfirmation": "Are you sure you want to end Remote Call?",
                    "Yes": "Yes",
                    "No": "No",
                    "TrackingPaused": "Tracking Paused",
                    "Presentations": "Presentations",
                    "Sequences": "Sequences",
                    "XofX": "{0} of {1}",
                    "SlideRequired": "Slide Required",
                    "SlideMustBeShown": "Slide {0} must be shown in order to advance"
                },
                "presentations": [
                    {
                        "id": "a4A1m0000008PMSEA2",
                        "name": "Presentation 1",
                        "sequences": [
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test2_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAN",
                                "externalId": "a4w1m00000001wyAAA",
                                "is_mandatory": false
                            }
                        ]
                    },
                    {
                        "id": "a4A1m0000008PMSEA3",
                        "name": "Presentation 2",
                        "sequences": [
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test2_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wyAAA",
                                "is_mandatory": false
                            },
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wxAAA",
                            }
                        ]
                    },
                    {
                        "id": "a4A1m0000008PMSEA4",
                        "name": "Presentation 3",
                        "sequences": [
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wxAAA",
                            }, {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test2_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wyAAA",
                                "is_mandatory": true
                            }, {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wxAAA",
                            }
                        ]
                    },
                    {
                        "id": "a4A1m0000008PMSEA5",
                        "name": "Presentation 4",
                        "sequences": [
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test2_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wyAAA",
                                "is_mandatory": true
                            },
                            {
                                "fileId": "a4u1m0000004CQ6AAM",
                                "key": "test_1234567890123_0.zip",
                                "id": "a4u1m0000004CQ6AAM",
                                "externalId": "a4w1m00000001wxAAA",
                            }
                        ]
                    }
                ]
            }
        }
    }, '*')
}
