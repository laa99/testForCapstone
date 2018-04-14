import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
export const Submitted_Data = new Mongo.Collection('submitted_data');

// cd C:\Program Files\MongoDB\Server\3.6\bin
// mongoexport --host localhost:3001 --db meteor --collection submitted_data --type=csv --fields geoLat,geoLong,height,createdAt --out submittedDataCSVs/submitteddata.csv
