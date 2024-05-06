const connection = require('../config/conn_mysql')
const poolPromise = require('../config/conn_sqlsever');
const sql = require('mssql');


const getEmployeeDataFromMySql = async () => {
    let [results, fields] = await connection.query(`SELECT e.*, p.*
    FROM mydb.employee e
    JOIN mydb.payrates p ON e.PayRates_idPayRates = p.idPayRates;`)
    return results
}
const getEmployeeDataFromSqlServer = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
    PERSONAL.PERSONAL_ID AS PERSONAL_ID_PERSONAL, 
    PERSONAL.CURRENT_FIRST_NAME AS CURRENT_FIRST_NAME_PERSONAL,
    PERSONAL.CURRENT_LAST_NAME AS CURRENT_LAST_NAME_PERSONAL,
    PERSONAL.CURRENT_MIDDLE_NAME AS CURRENT_MIDDLE_NAME_PERSONAL,
    PERSONAL.BIRTH_DATE AS BIRTH_DATE_PERSONAL,
    PERSONAL.SOCIAL_SECURITY_NUMBER AS SOCIAL_SECURITY_NUMBER_PERSONAL,
    PERSONAL.DRIVERS_LICENSE AS DRIVERS_LICENSE_PERSONAL,
    PERSONAL.CURRENT_ADDRESS_1 AS CURRENT_ADDRESS_1_PERSONAL,
    PERSONAL.CURRENT_ADDRESS_2 AS CURRENT_ADDRESS_2_PERSONAL,
    PERSONAL.CURRENT_CITY AS CURRENT_CITY_PERSONAL,
    PERSONAL.CURRENT_COUNTRY AS CURRENT_COUNTRY_PERSONAL,
    PERSONAL.CURRENT_ZIP AS CURRENT_ZIP_PERSONAL,
    PERSONAL.CURRENT_GENDER AS CURRENT_GENDER_PERSONAL,
    PERSONAL.CURRENT_PHONE_NUMBER AS CURRENT_PHONE_NUMBER_PERSONAL,
    PERSONAL.CURRENT_PERSONAL_EMAIL AS CURRENT_PERSONAL_EMAIL_PERSONAL,
    PERSONAL.CURRENT_MARITAL_STATUS AS CURRENT_MARITAL_STATUS_PERSONAL,
    PERSONAL.ETHNICITY AS ETHNICITY_PERSONAL,
    PERSONAL.SHAREHOLDER_STATUS AS SHAREHOLDER_STATUS_PERSONAL,
    PERSONAL.BENEFIT_PLAN_ID AS BENEFIT_PLAN_ID_PERSONAL,
    JOB_HISTORY.JOB_HISTORY_ID AS JOB_HISTORY_ID_JOB_HISTORY,
    JOB_HISTORY.DEPARTMENT AS DEPARTMENT_JOB_HISTORY,
    JOB_HISTORY.DIVISION AS DIVISION_JOB_HISTORY,
    JOB_HISTORY.FROM_DATE AS FROM_DATE_JOB_HISTORY,
    JOB_HISTORY.THRU_DATE AS THRU_DATE_JOB_HISTORY,
    JOB_HISTORY.JOB_TITLE AS JOB_TITLE_JOB_HISTORY,
    JOB_HISTORY.SUPERVISOR AS SUPERVISOR_JOB_HISTORY,
    JOB_HISTORY.LOCATION AS LOCATION_JOB_HISTORY,
    JOB_HISTORY.TYPE_OF_WORK AS TYPE_OF_WORK_JOB_HISTORY,
    EMPLOYMENT.EMPLOYMENT_ID AS EMPLOYMENT_ID_EMPLOYMENT,
    EMPLOYMENT.EMPLOYMENT_CODE AS EMPLOYMENT_CODE_EMPLOYMENT,
    EMPLOYMENT.EMPLOYMENT_STATUS AS EMPLOYMENT_STATUS_EMPLOYMENT,
    EMPLOYMENT.HIRE_DATE_FOR_WORKING AS HIRE_DATE_FOR_WORKING_EMPLOYMENT,
    EMPLOYMENT.WORKERS_COMP_CODE AS WORKERS_COMP_CODE_EMPLOYMENT,
    EMPLOYMENT.TERMINATION_DATE AS TERMINATION_DATE_EMPLOYMENT,
    EMPLOYMENT.REHIRE_DATE_FOR_WORKING AS REHIRE_DATE_FOR_WORKING_EMPLOYMENT,
    EMPLOYMENT.LAST_REVIEW_DATE AS LAST_REVIEW_DATE_EMPLOYMENT,
    EMPLOYMENT.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH AS NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH_EMPLOYMENT,
    EMPLOYMENT_WORKING_TIME.EMPLOYMENT_WORKING_TIME_ID AS EMPLOYMENT_WORKING_TIME_ID_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.YEAR_WORKING AS YEAR_WORKING_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.MONTH_WORKING AS MONTH_WORKING_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH AS NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH_EMPLOYMENT_WORKING_TIME,
    EMPLOYMENT_WORKING_TIME.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH AS TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH_EMPLOYMENT_WORKING_TIME,
    BENEFIT_PLANS.BENEFIT_PLANS_ID AS BENEFIT_PLANS_ID_BENEFIT_PLANS,
    BENEFIT_PLANS.PLAN_NAME AS PLAN_NAME_BENEFIT_PLANS,
    BENEFIT_PLANS.DEDUCTABLE AS DEDUCTABLE_BENEFIT_PLANS,
    BENEFIT_PLANS.PERCENTAGE_COPAY AS PERCENTAGE_COPAY_BENEFIT_PLANS,
    CASE 
        WHEN JOB_HISTORY.TYPE_OF_WORK = 1 THEN 'full time'
        WHEN JOB_HISTORY.TYPE_OF_WORK = 0 THEN 'part time'
        ELSE 'other' -- Optionally handle unexpected values
    END AS TYPE_OF_WORK_DESCRIPTION
FROM 
    PERSONAL,
    EMPLOYMENT,
    JOB_HISTORY,
    EMPLOYMENT_WORKING_TIME,
    BENEFIT_PLANS
WHERE 
    PERSONAL.PERSONAL_ID = EMPLOYMENT.PERSONAL_ID 
    AND EMPLOYMENT.EMPLOYMENT_ID = JOB_HISTORY.JOB_HISTORY_ID 
    AND PERSONAL.BENEFIT_PLAN_ID = BENEFIT_PLANS.BENEFIT_PLANS_ID
    AND EMPLOYMENT.EMPLOYMENT_ID = EMPLOYMENT_WORKING_TIME.EMPLOYMENT_ID;

        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_shareholder = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT
	
    BP.PLAN_NAME AS Benefit_Plan_Name,
    CASE 
        WHEN P.SHAREHOLDER_STATUS = 1 THEN 'Share Holder'
        WHEN P.SHAREHOLDER_STATUS = 0 THEN 'Non Shareholde'
    END AS Shareholder_Status,
    (
        SELECT AVG(BP.DEDUCTABLE)
        FROM BENEFIT_PLANS AS BP
        WHERE BP.BENEFIT_PLANS_ID = BP.BENEFIT_PLANS_ID
    ) AS Average_Benefit_Paid
FROM
    PERSONAL P, 
    EMPLOYMENT E, 
    BENEFIT_PLANS BP
WHERE
    P.PERSONAL_ID = E.PERSONAL_ID
    AND P.BENEFIT_PLAN_ID = BP.BENEFIT_PLANS_ID
GROUP BY
    BP.PLAN_NAME,
    P.SHAREHOLDER_STATUS;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}


const getall_birthday = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT *
FROM PERSONAL
WHERE MONTH(BIRTH_DATE) = MONTH(GETDATE())
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_planefect = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
        P.PERSONAL_ID,
    P.CURRENT_FIRST_NAME,
    P.CURRENT_LAST_NAME,
    P.SOCIAL_SECURITY_NUMBER,
    P.CURRENT_ADDRESS_1,
    P.CURRENT_PHONE_NUMBER,
    P.CURRENT_PERSONAL_EMAIL,
    E.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
    ET.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
FROM 
    PERSONAL P
JOIN 
    EMPLOYMENT E ON P.PERSONAL_ID = E.PERSONAL_ID
JOIN 
    EMPLOYMENT_WORKING_TIME ET ON E.EMPLOYMENT_ID = ET.EMPLOYMENT_ID
WHERE 
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH > 3;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const getall_employee_more_vacation = async () => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
        SELECT 
        P.PERSONAL_ID,
    P.CURRENT_FIRST_NAME,
    P.CURRENT_LAST_NAME,
    P.SOCIAL_SECURITY_NUMBER,
    P.CURRENT_ADDRESS_1,
    P.CURRENT_PHONE_NUMBER,
    P.CURRENT_PERSONAL_EMAIL,
    E.NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH,
    ET.NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH,
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH
FROM 
    PERSONAL P
JOIN 
    EMPLOYMENT E ON P.PERSONAL_ID = E.PERSONAL_ID
JOIN 
    EMPLOYMENT_WORKING_TIME ET ON E.EMPLOYMENT_ID = ET.EMPLOYMENT_ID
WHERE 
    ET.TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH >= 6;
        `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching data from SQL Server:', error);
        throw error;
    }
}

const createEm = async (idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear) => {
    let [results, fields] = await connection.query(
        'INSERT INTO `mydb`.`employee` (`idEmployee`, `EmployeeNumber`, `LastName`, `FirstName`, `SSN`, `PayRate`, `PayRates_idPayRates`, `VacationDays`, `PaidToDate`, `PaidLastYear`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [idem, emnum, lname, fname, ssn, payrate, idpayrate, vcd, paidtodate, paidlastyear],

    );
}
const createPer = async (idem, lname, fname, mname, birthday, ssn, drivers, adr1, adr2, curcity, curcountry, curzip, curgen, curphone, curmail, curstt, ethnicity, sharestt, benefitid) => {
    try {
        const pool = await poolPromise;
        const request = pool.request();

        const query = `
            INSERT INTO [dbo].[PERSONAL] (
                PERSONAL_ID, CURRENT_FIRST_NAME, CURRENT_LAST_NAME, CURRENT_MIDDLE_NAME, BIRTH_DATE,
                SOCIAL_SECURITY_NUMBER, DRIVERS_LICENSE, CURRENT_ADDRESS_1, CURRENT_ADDRESS_2, CURRENT_CITY,
                CURRENT_COUNTRY, CURRENT_ZIP, CURRENT_GENDER, CURRENT_PHONE_NUMBER, CURRENT_PERSONAL_EMAIL,
                CURRENT_MARITAL_STATUS, ETHNICITY, SHAREHOLDER_STATUS, BENEFIT_PLAN_ID
            )
            VALUES (@idem, @fname, @lname, @mname, @birthday, @ssn, @drivers, @adr1, @adr2, @curcity,
                @curcountry, @curzip, @curgen, @curphone, @curmail, @curstt, @ethnicity, @sharestt, @benefitid)
        `;

        const result = await request
            .input('idem', idem)
            .input('fname', sql.NVarChar(255), fname)
            .input('lname', sql.NVarChar(255), lname)
            .input('mname', sql.NVarChar(255), mname)
            .input('birthday', sql.NVarChar(255), birthday)
            .input('ssn', sql.NVarChar(255), ssn)
            .input('drivers', sql.NVarChar(255), drivers)
            .input('adr1', sql.NVarChar(255), adr1)
            .input('adr2', sql.NVarChar(255), adr2)
            .input('curcity', sql.NVarChar(255), curcity)
            .input('curcountry', sql.NVarChar(255), curcountry)
            .input('curzip', sql.Int, curzip)
            .input('curgen', sql.NVarChar(255), curgen)
            .input('curphone', sql.NVarChar(255), curphone)
            .input('curmail', sql.NVarChar(255), curmail)
            .input('curstt', sql.NVarChar(255), curstt)
            .input('ethnicity', sql.NVarChar(255), ethnicity)
            .input('sharestt', sql.NVarChar(255), sharestt)
            .input('benefitid', sql.NVarChar(255), benefitid)
            .query(query);

        return result;

    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};
module.exports = {
    getEmployeeDataFromMySql,
    getall_birthday, getall_planefect,
    getEmployeeDataFromSqlServer, getall_shareholder,
    getall_employee_more_vacation, createEm,
    createPer,
}