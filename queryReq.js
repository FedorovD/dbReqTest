const ObjectId = require('mongodb').ObjectId;
module.exports = [
    {
        "$match" : {
            "initiativeId" : ObjectId("58af4da0b310d92314627290"),
            "contacts.questions.category_id" : {
                "$in" : [ 
                    105, 
                    147
                ]
            },
            "contacts" : {
                "$elemMatch" : {
                    "datePublished" : {
                        "$ne" : null
                    }
                }
            }
        }
    },
    {$project: {
        '_id': 1,
        'initiativeId': 1,
        'contacts.id' : 1,
        'contacts.datePublished' : 1,
        'contacts.shortListedVendors' : 1,
        'contacts.vendors' : 1,
        'contacts.questions.criteria_value' : 1,
        'contacts.questions.label' : 1,
        'contacts.questions.raw_text' : 1,
        'contacts.questions.id' : 1,
        'contacts.questions.category_id' : 1,
        'contacts.win_vendor.is_client' : 1,
        'contacts.win_vendor.value' : 1,
        'contacts.win_vendor.name': 1,
        'contacts.questions.answers.criteria_value': 1,
        'contacts.questions.answers.primary_answer_value' : 1,
        'contacts.questions.answers.primary_answer_text' : 1,
        'contacts.questions.answers.loopInstances.is_selected' : 1,
        'contacts.questions.answers.loopInstances.loop_instance' : 1,
        'contacts.questions.answers.loopInstances.loop_text' : 1
        }},
    {
        "$unwind" : "$contacts"
    },
    {
        "$match" : {
            "contacts.datePublished" : {
                "$ne" : null
            }
        }
    },
    {
        "$match" : {
            "contacts.shortListedVendors" : {
                "$elemMatch" : {
                    "$or" : [ 
                        {
                            "name" : "ADP",
                            "is_selected" : true
                        }, 
                        {
                            "value" : {
                                "$in" : [ 
                                    50
                                ],
                                "$lt" : 9000
                            },
                            "is_selected" : true
                        }
                    ]
                }
            }
        }
    },
    {
        "$unwind" : "$contacts.questions"
    },
    {
        "$match" : {
            "contacts.questions.category_id" : {
                "$in" : [ 
                    105, 
                    147
                ]
            }
        }
    },
    {
        "$match" : {
            "$nor" : [ 
                {
                    "contacts.questions.category_id" : 105,
                    "contacts.questions.answers" : {
                        "$elemMatch" : {
                            "primary_answer_value" : {
                                "$gte" : 9000
                            },
                            "loopInstances" : {
                                "$elemMatch" : {
                                    "is_selected" : true,
                                    "$or" : [ 
                                        {
                                            "loop_instance" : {
                                                "$in" : [ 
                                                    50
                                                ]
                                            }
                                        }, 
                                        {
                                            "loop_text" : "ADP"
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    {
        "$unwind" : "$contacts.questions.answers"
    },
    {
        "$match" : {
            "contacts.questions.answers.primary_answer_value" : {
                "$lt" : 9000
            }
        }
    },
    {
        "$unwind" : "$contacts.questions.answers.loopInstances"
    },
    {
        "$project" : {
            "_id" : 1,
            "contacts.id" : 1,
            "contacts.datePublished" : 1,
            "contacts.shortListedVendors" : 1,
            "contacts.vendors" : 1,
            "contacts.questions.criteria_value" : 1,
            "criteria_value" : {
                "$ifNull" : [ 
                    "$contacts.questions.criteria_value", 
                    "$contacts.questions.answers.criteria_value"
                ]
            },
            "contacts.questions.label" : 1,
            "contacts.questions.raw_text" : 1,
            "contacts.questions.id" : 1,
            "contacts.questions.answers" : 1,
            "contacts.questions.category_id" : 1,
            "contacts.win_vendor" : 1,
            "clientWinner" : "$contacts.win_vendor.is_client",
            "competitorWinner" : {
                "$eq" : [ 
                    {
                        "$cmp" : [ 
                            {
                                "$and" : [ 
                                    {
                                        "$eq" : [ 
                                            "$clientWinner", 
                                            false
                                        ]
                                    }, 
                                    {
                                        "$or" : [ 
                                            {
                                                "$eq" : [ 
                                                    "$contacts.questions.answers.loopInstances.loop_instance", 
                                                    "$contacts.win_vendor.value"
                                                ]
                                            }, 
                                            {
                                                "$eq" : [ 
                                                    "$contacts.questions.category_id", 
                                                    147
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }, 
                            true
                        ]
                    }, 
                    0
                ]
            }
        }
    },
    {
        "$match" : {
            "$or" : [ 
                {
                    "contacts.questions.answers.loopInstances.loop_instance" : {
                        "$in" : [ 
                            50
                        ]
                    }
                }, 
                {
                    "contacts.questions.answers.loopInstances.loop_text" : "ADP"
                }, 
                {
                    "clientWinner" : false,
                    "contacts.questions.category_id" : 147,
                    "$or" : [ 
                        {
                            "contacts.win_vendor.value" : {
                                "$in" : [ 
                                    50
                                ]
                            }
                        }, 
                        {
                            "contacts.win_vendor.name" : "ADP"
                        }
                    ]
                }
            ]
        }
    },
{
        "$lookup" : {
            "from" : "clientCriteria",
                let: { criteria_value: "$criteria_value"},
                 pipeline: [
                    {
        "$match" : {
            "versions.initiativeId" : ObjectId("58af4da0b310d92314627290")
        }
    },
                  { $match:
                     { $expr:
                             { $eq: [ "$value",  "$$criteria_value" ] }
                     }
                  }
               ],
            "as" : "criteria"
        }
    }, 
    {
        "$group" : {
            "_id" : "$contacts.questions.answers.primary_answer_value",
            "answer_value" : {
                "$first" : "$contacts.questions.answers.primary_answer_value"
            },
            "answer_text" : {
                "$first" : "$contacts.questions.answers.primary_answer_text"
            },
            "answers" : {
                "$push" : {
                    "c" : "$contacts.id",
                    "question_category" : "$contacts.questions.category_id",
                    "question_id" : "$contacts.questions.id",
                    "ins" : "$contacts.questions.answers.loopInstances.loop_instance",
                    "answer_value" : "$contacts.questions.answers.primary_answer_value",
                    "selected" : "$contacts.questions.answers.loopInstances.is_selected",
                    "value" : "$criteria_value",
                    "text" : {$arrayElemAt: ['$criteria.label', 0]},
                    "definition" : {
                        "$ifNull" : [ 
                            {$arrayElemAt: [{$arrayElemAt: ['$criteria.versions.definition', 0]}, 0]},
                            {$arrayElemAt: ['$criteria.definition', 0]}
                        ]
                    }
                }
            },
            "count" : {
                "$sum" : 1
            }
        }
    }
];