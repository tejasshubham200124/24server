const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const axios = require('axios');
// const redis = require('redis');
// const client = redis.createClient({
//     host: '127.0.0.1', // Use the IP address for the local machine
//     port: 6379,       // Default Redis port
//   });

//   client.on('error', (err) => {
//     console.error('Redis client error:', err);
//   })



app.use(express.json());
const port = 8000;

const db = mysql.createConnection({
    host: '192.168.100.24',
    user: 'dvrhealth',
    password: 'dvrhealth',
    database: 'esurv'
});

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'esurvfour'
// });

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    } else {
        console.log('Connected to MySQL');
    }
});

app.use(cors({
    origin: 'http://192.168.100.24:3000'
}));


// app.use(cors({
//     origin: 'http://localhost:3000'
// }));



app.get('/TotalSites', (req, res) => {
    db.query('SELECT COUNT(DISTINCT atmid) AS atmCount FROM dvr_health', (err, result) => {
        if (err) {
            console.error('Error counting ATM IDs:', err);
            res.status(500).json({ error: 'Error counting ATM IDs' });
        } else {
            const atmCount = result[0].atmCount;
            // console.log('Total unique ATM IDs:', atmCount);
            res.status(200).json({ atmCount });
        }
    });
});




app.get('/TimeDifferenceCount', (req, res) => {
    const query = `
    SELECT COUNT(*) AS time_difference_count
FROM (
    SELECT
        dh.atmid,
        CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
    FROM
        dvr_health dh
    JOIN
        sites s ON dh.atmid = s.ATMID
    WHERE
        dh.login_status = 0
        AND s.live = 'Y'
) AS time_difference_sites;

    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting online entries:', err);
            res.status(500).json({ error: 'Error counting online entries' });
        } else {
            const { time_difference_count } = result[0];
            res.status(200).json({ time_difference_count });
        }
    });
});


app.get('/RecNotAvailableCount', (req, res) => {
    const query = `
    SELECT count(*) as recnotavailable FROM dvr_health WHERE live = 'Y' AND (recording_to <> CURDATE() OR recording_to IS NULL);;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting online entries:', err);
            res.status(500).json({ error: 'Error counting online entries' });
        } else {
            const { recnotavailable } = result[0];
            res.status(200).json({ recnotavailable });
        }
    });
});

app.get('/RecNotAvailableDetails', (req, res) => {
    const page = req.query.page || 1;
    const recordsPerPage = 50;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';

    let query = `
    SELECT
        dh.atmid,
        dh.login_status,
        DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
        dh.cam1,
        dh.cam2,
        dh.cam3,
        dh.cam4,
        dh.dvrtype,
        DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
        DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
        DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
        DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
        dh.ip AS routerip,
        CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
        CONCAT(
            FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60),
            ':',
            MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)
        ) AS time_difference_hours_minutes
    FROM
        dvr_health dh
    WHERE
        dh.recording_to <> CURDATE()
        AND dh.live = 'Y'
    `;

    if (atmid) {
        query += ` AND dh.atmid LIKE '%${atmid}%'`;
    }

    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT count(*) as recnotavailable FROM dvr_health WHERE live = 'Y' AND (recording_to <> CURDATE() OR recording_to IS NULL);`;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].recnotavailable });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});







app.get('/devicehistory/:atmId', (req, res) => {
    const atmId = req.params.atmId;

    db.query(`
    SELECT 
    *,
    CASE 
        WHEN hdd = 'ok' THEN 'working'
        ELSE 'not working'
    END AS hdd_status,
    CASE 
        WHEN login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status_status,
    DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(cdate, '%Y-%m-%d %H:%i:%s') AS cdate
FROM 
    dvr_history 
WHERE 
    atmid = ?
ORDER BY last_communication DESC;`, [atmId], (err, result) => {
        if (err) {
            console.error('Error fetching history data for ATM ID:', err);
            res.status(500).json({ error: 'Error fetching history data' });
        } else {
            res.status(200).json(result);
        }
    });

});





app.get('/OnlineSites', (req, res) => {
    const query = `
        SELECT COUNT(*) AS online_count
        FROM dvr_health
        WHERE login_status = 0;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting online entries:', err);
            res.status(500).json({ error: 'Error counting online entries' });
        } else {
            const { online_count } = result[0];
            res.status(200).json({ online_count });
        }
    });
});


app.get('/OfflineSites', (req, res) => {
    const query = `
        SELECT COUNT(*) AS offline_count
        FROM dvr_health
        WHERE login_status = 1 OR login_status IS NULL;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting offline entries:', err);
            res.status(500).json({ error: 'Error counting offline entries' });
        } else {
            const { offline_count } = result[0];

            res.status(200).json({ offline_count });
        }
    });
});

app.get('/NetworkReportTotalSites', (req, res) => {
    const query = `
    SELECT COUNT(DISTINCT site_id) AS distinct_atmid_count
    FROM port_status_network_report;
    
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting offline entries:', err);
            res.status(500).json({ error: 'Error counting offline entries' });
        } else {
            const { distinct_atmid_count } = result[0];

            res.status(200).json({ distinct_atmid_count });
        }
    });
});


app.get('/NetworkReportWorkingCount', (req, res) => {
    const query = `
    SELECT
    COUNT(*) AS working_count_records
FROM (
    SELECT
        psnr.site_id
    FROM
        port_status_network_report psnr
    JOIN
        sites st ON psnr.site_id = st.SN
    WHERE
        psnr.latency > 0
        AND DATE(psnr.rectime) = CURRENT_DATE
    GROUP BY
        psnr.site_id
) AS subquery;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting offline entries:', err);
            res.status(500).json({ error: 'Error counting offline entries' });
        } else {
            const { working_count_records } = result[0];

            res.status(200).json({ working_count_records });
        }
    });
});


app.get('/NetworkReportNotWorkingCount', (req, res) => {
    const query = `
    SELECT
    COUNT(*) AS notworking_records
FROM
    (
        SELECT
            MAX(rectime) AS max_rectime
        FROM
            port_status_network_report
        WHERE
            latency = 0
        GROUP BY
            site_id
    ) AS subquery;
    
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting offline entries:', err);
            res.status(500).json({ error: 'Error counting offline entries' });
        } else {
            const { notworking_records } = result[0];

            res.status(200).json({ notworking_records });
        }
    });
});

app.get('/networkreportworking', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;
    const ATMID = req.query.ATMID || '';

    console.log('ATMID:', ATMID)

    const query = `
    SELECT
    psnr.site_id,
    psnr.http_port,
    psnr.sdk_port,
    psnr.ai_port,
    psnr.router_port,
    psnr.rtsp_port,
    DATE_FORMAT(psnr.rectime, '%Y-%m-%d %H:%i:%s') AS rectime,
    psnr.latency,
    st.Bank,
    st.ATMID  -- Use the ATMID from the sites table
FROM
    port_status_network_report psnr
JOIN
    sites st ON psnr.site_id = st.SN  -- Adjust the join condition
WHERE
    psnr.latency > 0
    AND DATE(psnr.rectime) = CURRENT_DATE
GROUP BY
    psnr.site_id
ORDER BY
    psnr.site_id ASC
        LIMIT ${recordsPerPage} OFFSET ${offset}
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching network report data:', err);
            res.status(500).json({ error: 'Error fetching network report data' });
        } else {
            if (!ATMID) {
                const totalCountQuery = `
                SELECT
                    COUNT(*) AS totalCount
                FROM (
                    SELECT
                        psnr.site_id
                    FROM
                        port_status_network_report psnr
                    JOIN
                        sites st ON psnr.site_id = st.SN
                    WHERE
                        psnr.latency > 0
                        AND DATE(psnr.rectime) = CURRENT_DATE
                        
                    GROUP BY
                        psnr.site_id
                ) AS subquery;
            `;
            
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});

app.get('/networkreportnotworking', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';

    const query = `
        SELECT
            psnr.site_id,
            psnr.http_port,
            psnr.sdk_port,
            psnr.ai_port,
            psnr.router_port,
            psnr.rtsp_port,
            ps.ATMID
        FROM port_status_network_report psnr
        JOIN port_status ps ON psnr.site_id = ps.site_sn
        WHERE psnr.latency = 0
          AND psnr.rectime = (
            SELECT MAX(rectime)
            FROM port_status_network_report
            AND latency = 0
          )
        GROUP BY psnr.site_id
        ORDER BY psnr.site_id ASC
        LIMIT ${recordsPerPage} OFFSET ${offset};
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching network report data:', err);
            res.status(500).json({ error: 'Error fetching network report data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `
                SELECT
                psnr.site_id,
                psnr.http_port,
                psnr.sdk_port,
                psnr.ai_port,
                psnr.router_port,
                psnr.rtsp_port,
                ps.ATMID
            FROM port_status_network_report psnr
            JOIN port_status ps ON psnr.site_id = ps.site_sn
            WHERE psnr.latency = 0
              AND psnr.rectime = (
                SELECT MAX(rectime)
                FROM port_status_network_report
                WHERE site_id = psnr.site_id
                AND latency = 0
              )
            GROUP BY psnr.site_id
            ORDER BY psnr.site_id ASC
                `;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});



app.get('/networkreport', (req, res) => {
    const query = `
    SELECT
    psnr.site_id,
    psnr.http_port,
    psnr.sdk_port,
    psnr.ai_port,
    psnr.router_port,
    psnr.rtsp_port,
    ps.atmid
FROM port_status_network_report psnr
JOIN (
    SELECT site_id, MAX(rectime) AS latest_rectime
    FROM port_status_network_report
    GROUP BY site_id
) AS latest_status
ON psnr.site_id = latest_status.site_id AND psnr.rectime = latest_status.latest_rectime
JOIN port_status ps ON psnr.site_id = ps.site_sn
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/networkreporttwo', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;

    const query = `
    SELECT
    p.site_id,
    p.http_port,
    p.rtsp_port,
    p.router_port,
    p.sdk_port,
    p.ai_port,
    DATE_FORMAT(p.rectime, '%Y-%m-%d %H:%i:%s') AS rectime,
    s.ATMID,
    s.Bank
FROM
    port_status_network_report p
JOIN
    sites s ON p.site_id = s.SN AND s.live = 'Y'
WHERE
    (p.site_id, p.rectime) IN (SELECT site_id, MAX(rectime) FROM port_status_network_report GROUP BY site_id)
ORDER BY
    p.site_id ASC
        LIMIT ${recordsPerPage} OFFSET ${offset};
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching network report data:', err);
            res.status(500).json({ error: 'Error fetching network report data' });
        } else {
            const totalCountQuery = `SELECT COUNT(DISTINCT site_id) AS totalCount FROM port_status_network_report`;
            db.query(totalCountQuery, (err, countResult) => {
                if (err) {
                    console.error('Error fetching total count of records:', err);
                    res.status(500).json({ error: 'Error fetching total count of records' });
                } else {
                    res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                }
            });
        }
    });
});



app.get('/hddnotworking', (req, res) => {
    const query = `
        SELECT COUNT(*) AS non_ok_hdd_count FROM dvr_health WHERE NOT (hdd = 'ok' OR hdd = 'OK');
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            res.status(200).json(result[0]);
        }
    });
});

app.get('/hddnotworkingsites', (req, res) => {
    const query = `
    SELECT 
    d.ip, 
    d.atmid, 
    d.cam1, 
    d.cam2, 
    d.cam3, 
    d.cam4, 
    d.dvrtype,
    DATE_FORMAT(d.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    s.city, 
    s.state, 
    s.zone, 
    d.hdd, 
    CASE 
        WHEN d.login_status = '0' THEN 'working' 
        ELSE 'not working' 
    END AS login_status, 
    DATEDIFF(NOW(), d.cdate) AS days_difference 
FROM 
    dvr_health d 
JOIN 
    sites s 
ON 
    d.atmid = s.atmid 
WHERE 
    NOT (d.hdd = 'ok' OR d.hdd = 'OK') 
    AND s.live = 'Y';


    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/hddwithStatus', (req, res) => {
    const query = `
    SELECT 
    d.ip, 
    d.atmid, 
    d.cam1, 
    d.cam2, 
    d.cam3, 
    d.cam4, 
    DATE_FORMAT(d.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    s.city, 
    s.state, 
    s.zone, 
    d.hdd, 
    CASE 
        WHEN d.login_status = '0' THEN 'working' 
        ELSE 'not working' 
    END AS login_status, 
    DATEDIFF(NOW(), d.cdate) AS days_difference 
FROM 
    dvr_health d 
JOIN 
    sites s 
ON 
    d.atmid = s.atmid;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/summaryData', (req, res) => {
    const query = `
    SELECT hdd, COUNT(*) AS count_per_value FROM dvr_health GROUP BY hdd;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/unformattedSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, 
    dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, 
    dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, 
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    dh.hdd = 'unformatted'
    AND s.live = 'Y';

    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/abnormalSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, 
    dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, 
    dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, -- Calculate login status
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    dh.hdd = 'abnormal' -- Filter for 'abnormal' condition
    AND s.live = 'Y';
;
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/NullSites', (req, res) => {
    const query = `
    SELECT
    dh.ip,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    dh.atmid,
    dh.recording_from,
    dh.recording_to,
    s.City,
    s.State,
    s.Zone,
    CASE
        WHEN dh.login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status,
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference
FROM
    dvr_health dh
JOIN
    sites s ON dh.atmid = s.ATMID
WHERE
    dh.hdd IS NULL
    AND s.live = 'Y';

    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/noDiscIdleSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, 
    dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, 
    dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, -- Calculate login status
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    dh.hdd = 'No disk/idle'
    AND s.live = 'Y';

    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/errorSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, -- Calculate login status
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    dh.hdd IN ('Error', '1', '2')
    AND s.live = 'Y';
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/NoDiskSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, -- Calculate login status
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    dh.hdd = 'No Disk'
    AND s.live = 'Y';
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/okSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status, -- Calculate login status
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference -- Calculate days difference
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
(dh.hdd = 'ok' OR dh.hdd = 'OK')
    AND s.live = 'Y';
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/notexistSites', (req, res) => {
    const query = `
    SELECT 
    dh.ip, 
    dh.cam1, dh.cam2, dh.cam3, dh.cam4, 
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, 
    dh.atmid, 
    dh.recording_from, dh.recording_to,
    s.City, s.State, s.Zone,
    DATEDIFF(CURDATE(), dh.cdate) AS days_difference, -- Calculate days difference
    CASE WHEN dh.login_status = 0 THEN 'working' ELSE 'not working' END AS login_status -- Calculate login status
FROM 
    dvr_health dh
JOIN 
    sites s ON dh.atmid = s.ATMID
WHERE 
    (dh.hdd = 'Not exist' OR dh.hdd = 'notexist')
    AND s.live = 'Y';

    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/hddcalllog', (req, res) => {
    const query = `
   
    SELECT DISTINCT dh.atmid, dh2.hdd AS previous_status, dh.hdd AS current_status
    FROM dvr_health dh
    JOIN dvr_history dh2 ON dh.atmid = dh2.atmid
    WHERE 
        DATE(dh2.last_communication) = CURDATE()
        AND dh.hdd <> dh2.hdd;
    
    `;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR history data:', err);
            res.status(500).json({ error: 'Error fetching DVR history data' });
        } else {
            res.status(200).json(result);
        }
    });
});





app.get('/CameraNotWorking', (req, res) => {
    const query = `
    SELECT COUNT(CASE WHEN cam1 = 'not working' THEN 1 END) AS cam1_count, COUNT(CASE WHEN cam2 = 'not working' THEN 1 END) AS cam2_count, COUNT(CASE WHEN cam3 = 'not working' THEN 1 END) AS cam3_count, COUNT(CASE WHEN cam4 = 'not working' THEN 1 END) AS cam4_count FROM dvr_health;;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting "not working" or "null" entries:', err);
            res.status(500).json({ error: 'Error counting "not working" or "null" entries' });
        } else {
            const counts = {
                cam1_count: result[0].cam1_count,
                cam2_count: result[0].cam2_count,
                cam3_count: result[0].cam3_count,
                cam4_count: result[0].cam4_count
            };
            res.status(200).json(counts);
        }
    });
});

app.get('/cam1_not_working', (req, res) => {
    const query = `
        SELECT ip, cam1,
            CASE WHEN hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            CASE WHEN login_status = 0 THEN 'working' ELSE 'not working' END AS login_status,
            DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, atmid, recording_from, recording_to, dvrtype
        FROM dvr_health
        WHERE cam1 = 'not working';
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving data where cam1 is not working:', err);
            res.status(500).json({ error: 'Error retrieving data' });
        } else {
            // console.log('Data where cam1 is not working:', result);
            res.status(200).json(result);
        }
    });
});
app.get('/cam2_not_working', (req, res) => {
    const query = `
        SELECT ip, cam2,
            CASE WHEN hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            CASE WHEN login_status = 0 THEN 'working' ELSE 'not working' END AS login_status,
            DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, atmid, recording_from, recording_to, dvrtype
        FROM dvr_health
        WHERE cam2 = 'not working';
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving data where cam1 is not working:', err);
            res.status(500).json({ error: 'Error retrieving data' });
        } else {
            // console.log('Data where cam1 is not working:', result);
            res.status(200).json(result);
        }
    });
});
app.get('/cam3_not_working', (req, res) => {
    const query = `
        SELECT ip, cam3,
            CASE WHEN hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            CASE WHEN login_status = 0 THEN 'working' ELSE 'not working' END AS login_status,
            DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, atmid, recording_from, recording_to, dvrtype
        FROM dvr_health
        WHERE cam3 = 'not working';
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving data where cam1 is not working:', err);
            res.status(500).json({ error: 'Error retrieving data' });
        } else {
            // console.log('Data where cam1 is not working:', result);
            res.status(200).json(result);
        }
    });
});
app.get('/cam4_not_working', (req, res) => {
    const query = `
        SELECT ip, cam4,
            CASE WHEN hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            CASE WHEN login_status = 0 THEN 'working' ELSE 'not working' END AS login_status,
            DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication, atmid, recording_from, recording_to, dvrtype
        FROM dvr_health
        WHERE cam4 = 'not working';
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving data where cam1 is not working:', err);
            res.status(500).json({ error: 'Error retrieving data' });
        } else {
            // console.log('Data where cam1 is not working:', result);
            res.status(200).json(result);
        }
    });
});

app.get('/neveron', (req, res) => {
    const query = `
    SELECT COUNT(*) AS neveron FROM dvr_health WHERE cdate IS NULL OR cdate = '';
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting data where last_communication is not today:', err);
            res.status(500).json({ error: 'Error counting data' });
        } else {
            const { neveron } = result[0];
            // console.log('Count of data where last_communication is not today:', neveron);
            res.status(200).json({ neveron });
        }
    });
});


app.get('/neverondetails', (req, res) => {
    const query = `
    SELECT
    dvr_health.atmid,
    dvr_health.ip,
    sites.CITY,
    sites.STATE,
    sites.ZONE,
    sites.SiteAddress
FROM
    dvr_health
JOIN
    sites
ON
    dvr_health.atmid = sites.ATMID
WHERE
    dvr_health.cdate IS NULL OR dvr_health.cdate = '';
;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.status(200).json(result);
        }
    });
});



app.get('/TimeDifferenceDetails', (req, res) => {
    const page = req.query.page || 1;
    const recordsPerPage = 50;
    const offset = (page - 1) * recordsPerPage;

    const query = `
    SELECT
    dh.atmid,
    dh.login_status,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,          
    dh.ip AS routerip,
    CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
    s.city,
    s.state,
    s.zone,
    CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
FROM
    dvr_health dh
JOIN
    sites s ON dh.atmid = s.ATMID
WHERE
    dh.login_status = 0
    AND s.live = 'Y'
        LIMIT ${recordsPerPage} OFFSET ${offset};
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            const totalCountQuery = 'SELECT COUNT(*) AS total__count FROM dvr_health WHERE login_status = 0';
            db.query(totalCountQuery, (err, countResult) => {
                if (err) {
                    console.error('Error fetching total count of records:', err);
                    res.status(500).json({ error: 'Error fetching total count of records' });
                } else {
                    res.status(200).json({ data: result, totalCount: countResult[0].total__count });
                }
            });
        }
    });
});





app.get('/TotalHours', (req, res) => {
    const query = `
    SELECT
    COUNT(DISTINCT dvr_health.atmid) AS total_sites
FROM
    dvr_health
JOIN
    sites ON dvr_health.atmid = sites.ATMID
WHERE
    dvr_health.login_status = 0
    AND sites.live = 'Y';

    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error counting online entries:', err);
            res.status(500).json({ error: 'Error counting online entries' });
        } else {
            const { total_sites } = result[0];

            res.status(200).json({ total_sites });
        }
    });
});

app.get('/30DaysAging', (req, res) => {
    const query = `
        SELECT
            dvr_health.atmid,
            
            sites.city,
            sites.state,
            sites.zone,
            DATEDIFF(NOW(), dvr_health.cdate) AS days_difference
        FROM
            dvr_health
        JOIN
            sites ON dvr_health.atmid = sites.ATMID
        WHERE
            (dvr_health.login_status = 1 OR dvr_health.login_status IS NULL)
            AND sites.live = 'Y'
            AND DATEDIFF(NOW(), dvr_health.cdate) > 30;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/30DaysAgingDetails', (req, res) => {
    const query = `
        SELECT
            dvr_health.atmid,
            DATE_FORMAT(dvr_health.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,      
            CASE
            WHEN dvr_health.login_status = 0 THEN 'working'
            ELSE 'not working'
        END AS login_status,
            dvr_health.ip,
            CASE WHEN dvr_health.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dvr_health.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dvr_health.cdate, NOW()), 60)) AS time_difference_hours_minutes,
            sites.city,
            sites.state,
            sites.zone,
            DATEDIFF(NOW(), dvr_health.cdate) AS days_difference
        FROM
            dvr_health
        JOIN
            sites ON dvr_health.atmid = sites.ATMID
        WHERE
            (dvr_health.login_status = 1 OR dvr_health.login_status IS NULL)
            AND sites.live = 'Y'
            AND DATEDIFF(NOW(), dvr_health.cdate) > 7;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.status(200).json(result);
        }
    });
});


app.get('/30DaysAgingCount', (req, res) => {
    const query = `
        SELECT
            COUNT(*) AS count
        FROM
            dvr_health
        JOIN
            sites ON dvr_health.atmid = sites.ATMID
        WHERE
            (dvr_health.login_status = 1 OR dvr_health.login_status IS NULL)
            AND sites.live = 'Y'
            AND DATEDIFF(NOW(), dvr_health.cdate) > 7;
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({ error: 'Error executing query' });
        } else {
            res.status(200).json({ count: result[0].count });
        }
    });
});

app.get('/OfflineSiteDetails', (req, res) => {
    const page = req.query.page || 1;
    const recordsPerPage = 50;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';

    let query = `
        SELECT
            dh.atmid,
            dh.login_status,
            DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
            dh.cam1,
            dh.cam2,
            dh.cam3,
            dh.cam4,
            dh.dvrtype,
            DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
            dh.ip AS routerip,
            CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            s.city,
            s.state,
            s.zone,
            CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
        FROM
            dvr_health dh
        JOIN
            sites s ON dh.atmid = s.ATMID
        WHERE
            dh.login_status = 1 OR dh.login_status IS NULL
            AND s.live = 'Y'`;

    if (atmid) {
        query += ` AND dh.atmid LIKE '%${atmid}%'`;
    }

    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT COUNT(*) AS offline_count 
                FROM dvr_health 
                WHERE (login_status = 0 OR login_status IS NULL) 
                      AND live = 'Y';
                `;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].offline_count });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});


app.get('/OnlineSiteDetails', (req, res) => {
    const page = req.query.page || 1;
    const recordsPerPage = 50;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';

    let query = `
        SELECT
            dh.atmid,
            dh.login_status,
            DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
            dh.cam1,
            dh.cam2,
            dh.cam3,
            dh.cam4,
            dh.dvrtype,
            DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
            DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
            DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
            DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,          
            dh.ip AS routerip,
            CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            s.city,
            s.state,
            s.zone,
            CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
        FROM
            dvr_health dh
        JOIN
            sites s ON dh.atmid = s.ATMID
        WHERE
            dh.login_status = 0
            AND s.live = 'Y'`;

    if (atmid) {
        query += ` AND dh.atmid LIKE '%${atmid}%'`;
    }

    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT COUNT(*) AS online_count FROM dvr_health WHERE login_status = 0`;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].online_count });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});


// app.get('/PanelHealthDetailsapid', (req, res) => {
//     const page = req.query.page || 1;
//     const recordsPerPage = 50;
//     const offset = (page - 1) * recordsPerPage;
//     const atmid = req.query.atmid || '';

//     const apiUrl = 'http://103.141.218.26:8080/Hitachi/api/panel_health_data_report_ajax_api.php';

//     axios.get(apiUrl)
//         .then(response => {
//             const responseData = response.data[0];

//             if (responseData && responseData.res_data && Array.isArray(responseData.res_data)) {
//                 let result = responseData.res_data;

//                 if (atmid) {
//                     // Filter results by atmid if atmid is provided
//                     result = result.filter(record => record.atmid.includes(atmid));
//                 }

//                 const cleanedResult = result.slice(offset, offset + recordsPerPage);

//                 // Parse the zone_config field
//                 cleanedResult.forEach(record => {
//                     if (record.zone_config) {
//                         try {
//                             const parsedZoneConfig = JSON.parse(record.zone_config);
//                             record.zone_config = parsedZoneConfig;
//                         } catch (e) {
//                             console.error('Error parsing zone_config:', e);
//                         }
//                     }
//                 });

//                 if (!atmid) {
//                     const totalCount = result.length;
//                     res.status(200).json({ data: cleanedResult, totalCount });
//                 } else {
//                     res.status(200).json({ data: cleanedResult });
//                 }
//             } else {
//                 console.error('Error: Response data is not in the expected format.');
//                 res.status(500).json({ error: 'Error fetching panel health data' });
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching panel health data:', error);
//             res.status(500).json({ error: 'Error fetching panel health data' });
//         });
// });


app.get('/PanelHealthDetailsapid', (req, res) => {
    const page = req.query.page || 1;
    const recordsPerPage = 50;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';
    const filterStatus = req.query.status || ''; // Add status as a query parameter

    const apiUrl = 'http://103.141.218.26:8080/Hitachi/api/panel_health_data_report_ajax_api.php';

    axios.get(apiUrl)
        .then(response => {
            const responseData = response.data[0];

            if (responseData && responseData.res_data && Array.isArray(responseData.res_data)) {
                let result = responseData.res_data;

                if (atmid) {
                    // Filter results by atmid if atmid is provided
                    result = result.filter(record => record.atmid.includes(atmid));
                }

                if (filterStatus) {
                    // Filter results based on the status query parameter
                    result = result.filter(record => {
                        // Assuming "status" is a field in your data, adjust this as per your data structure
                        return record.status === filterStatus;
                    });
                }
                const cleanedResult = result.slice(offset, offset + recordsPerPage);
                cleanedResult.forEach(record => {
                    if (record.zone_config) {
                        try {
                            const parsedZoneConfig = JSON.parse(record.zone_config);
                            record.zone_config = parsedZoneConfig;
                        } catch (e) {
                            console.error('Error parsing zone_config:', e);
                        }
                    }
                });

                if (!atmid) {
                    const totalCount = result.length;
                    res.status(200).json({ data: cleanedResult, totalCount });
                } else {
                    res.status(200).json({ data: cleanedResult });
                }
            } else {
                console.error('Error: Response data is not in the expected format.');
                res.status(500).json({ error: 'Error fetching panel health data' });
            }
        })
        .catch(error => {
            console.error('Error fetching panel health data:', error);
            res.status(500).json({ error: 'Error fetching panel health data' });
        });
});




const formatDate = (inputDate) => {

    const dateObj = new Date(inputDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};


app.get('/devicehistoryThree/:atmId', (req, res) => {
    const atmId = req.params.atmId;
    const page = req.query.page || 1;
    const recordsPerPage = 100;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    console.log('Received startDate:', startDate);
    console.log('Received endDate:', endDate);


    const formattedStartDate = startDate ? formatDate(startDate) + ' 00:00:00' : null;
    const formattedEndDate = endDate ? formatDate(endDate) + ' 23:59:59' : null;

    let query = `
      SELECT 
          *,
          CASE 
              WHEN hdd = 'ok' THEN 'working'
              ELSE 'not working'
          END AS hdd_status,
          CASE 
              WHEN login_status = 0 THEN 'working'
              ELSE 'not working'
          END AS login_status,
          DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
          DATE_FORMAT(recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
          DATE_FORMAT(recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
          DATE_FORMAT(cdate, '%Y-%m-%d %H:%i:%s') AS cdate
      FROM 
          dvr_history 
      WHERE 
          atmid = ?`;

    if (formattedStartDate && formattedEndDate) {
        query += ` AND last_communication between  ? AND  ?`;
    }

    query += ` ORDER BY last_communication ASC`;

    const totalCountQuery = `
      SELECT COUNT(*) AS totalCount
      FROM dvr_history
      WHERE atmid = ?
    `;

    db.query(totalCountQuery, [atmId, formattedStartDate, formattedEndDate], (err, countResult) => {
        if (err) {
            console.error('Error fetching total count of records:', err);
            res.status(500).json({ error: 'Error fetching total count of records' });
        } else {
            const totalCount = countResult[0].totalCount;

            const offset = (page - 1) * recordsPerPage;

            query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;

            db.query(query, [atmId, formattedStartDate, formattedEndDate], (err, result) => {
                if (err) {
                    console.error('Error fetching history data for ATM ID:', err);
                    res.status(500).json({ error: 'Error fetching history data' });
                } else {
                    res.status(200).json({ data: result, totalCount, query });
                }
            });
        }
    });
});







app.get('/AllSites', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';


    console.log('Received search ATM ID:', atmid);

    let query = `
        SELECT
            dh.ip,
            dh.cam1,
            dh.cam2,
            dh.cam3,
            dh.cam4,
            dh.latency,
            CASE
                WHEN dh.hdd = 'ok' THEN 'working'
                ELSE 'not working'
            END AS hdd_status,
            CASE
                WHEN dh.login_status = 0 THEN 'working'
                ELSE 'not working'
            END AS login_status,
            dh.atmid,
            dh.dvrtype,
          
            DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
            DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
            DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
            DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
          
            s.City,
            s.State,
            s.Zone
        FROM
            dvr_health dh
        JOIN
            sites s
        ON
            dh.atmid = s.ATMID`;

    if (atmid) {
        query += ` WHERE LOWER(dh.atmid) LIKE '%${atmid.toLowerCase()}%'`;
    }

    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM dvr_health`;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});


app.get('/AllSitesTwodemo', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';
    let query = `
   SELECT
    dh.ip,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.latency,
    CASE
        WHEN dh.hdd = 'ok' THEN 'working'
        ELSE 'not working'
    END AS hdd_status,
    CASE
        WHEN dh.login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status,
    dh.atmid,
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    s.City,
    s.State,
    s.Zone,
    s.Bank,
    ps.rtsp_port,
    ps.sdk_port,
    ps.router_port,
    ps.http_port,
    ps.ai_port,
    psnr.http_port AS http_port_status,
    psnr.sdk_port AS sdk_port_status,
    psnr.router_port AS router_port_status,
    psnr.rtsp_port AS rtsp_port_status,
    psnr.ai_port AS ai_port_status
FROM
    dvr_health dh
JOIN
    sites s
ON
    dh.atmid = s.ATMID
LEFT JOIN
    port_status ps
ON
    dh.atmid = ps.ATMID
LEFT JOIN (
    SELECT
        site_id,
        MAX(rectime) AS latest_rectime
    FROM
        port_status_network_report
    GROUP BY
        site_id
) AS latest_status
ON
    ps.site_sn = latest_status.site_id
LEFT JOIN port_status_network_report psnr
ON
    ps.site_sn = psnr.site_id
    AND latest_status.latest_rectime = psnr.rectime
 `;
    if (atmid) {
        query += ` WHERE LOWER(dh.atmid) LIKE '%${atmid.toLowerCase()}%'`;
    }
    query += ` ORDER BY dh.atmid`;
    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM dvr_health`;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});



app.get('/demo', (req, res) => {
    const recordsPerPage = 50;
    const page = req.query.page || 1;
    const offset = (page - 1) * recordsPerPage;
    const atmid = req.query.atmid || '';
    let query = `
   SELECT
    dh.ip,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.latency,
    CASE
        WHEN dh.hdd = 'ok' THEN 'working'
        ELSE 'not working'
    END AS hdd_status,
    CASE
        WHEN dh.login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status,
    dh.atmid,
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    s.City,
    s.State,
    s.Zone,
    // ps.rtsp_port,
    // ps.sdk_port,
    // ps.router_port,
    // ps.http_port,
    // ps.ai_port,
    psnr.http_port AS http_port_status,
    psnr.sdk_port AS sdk_port_status,
    psnr.router_port AS router_port_status,
    psnr.rtsp_port AS rtsp_port_status,
    psnr.ai_port AS ai_port_status
FROM
    dvr_health dh
JOIN
    sites s
ON
    dh.atmid = s.ATMID
LEFT JOIN
    port_status ps
ON
    dh.atmid = ps.ATMID
LEFT JOIN (
    SELECT
        site_id,
        MAX(rectime) AS latest_rectime
    FROM
        port_status_network_report
    GROUP BY
        site_id
) AS latest_status
ON
    ps.site_sn = latest_status.site_id
LEFT JOIN port_status_network_report psnr
ON
    ps.site_sn = psnr.site_id
    AND latest_status.latest_rectime = psnr.rectime
 `;
    if (atmid) {
        query += ` WHERE LOWER(dh.atmid) LIKE '%${atmid.toLowerCase()}%'`;
    }
    query += ` ORDER BY dh.atmid`;
    query += ` LIMIT ${recordsPerPage} OFFSET ${offset};`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data:', err);
            res.status(500).json({ error: 'Error fetching DVR health data' });
        } else {
            if (!atmid) {
                const totalCountQuery = `SELECT COUNT(*) AS totalCount FROM dvr_health`;
                db.query(totalCountQuery, (err, countResult) => {
                    if (err) {
                        console.error('Error fetching total count of records:', err);
                        res.status(500).json({ error: 'Error fetching total count of records' });
                    } else {
                        res.status(200).json({ data: result, totalCount: countResult[0].totalCount });
                    }
                });
            } else {
                res.status(200).json({ data: result });
            }
        }
    });
});


app.get('/ExportAllSites', (req, res) => {

    let query = `
    SELECT
    dh.atmid,
    dh.ip,
    s.Bank,
    s.City,
    s.State,
    s.Zone,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.latency,
    CASE
        WHEN dh.hdd = 'ok' THEN 'working'
        ELSE 'not working'
    END AS hdd_status,
    CASE
        WHEN dh.login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status, 
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    ps.rtsp_port,
    ps.sdk_port,
    ps.router_port,
    ps.http_port,
    ps.ai_port,
    psnr.http_port AS http_port_status,
    psnr.sdk_port AS sdk_port_status,
    psnr.router_port AS router_port_status,
    psnr.rtsp_port AS rtsp_port_status,
    psnr.ai_port AS ai_port_status
FROM
    dvr_health dh
JOIN
    sites s
ON
    dh.atmid = s.ATMID
LEFT JOIN
    port_status ps
ON
    dh.atmid = ps.ATMID
LEFT JOIN (
    SELECT
        site_id,
        MAX(rectime) AS latest_rectime
    FROM
        port_status_network_report
    GROUP BY
        site_id
) AS latest_status
ON
    ps.site_sn = latest_status.site_id
LEFT JOIN port_status_network_report psnr
ON
    ps.site_sn = psnr.site_id
    AND latest_status.latest_rectime = psnr.rectime
`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});


app.get('/ExportNetworkReport', (req, res) => {
    let query = `
    SELECT
    p.site_id,
    p.http_port,
    p.rtsp_port,
    p.router_port,
    p.sdk_port,
    p.ai_port,
    DATE_FORMAT(p.rectime, '%Y-%m-%d %H:%i:%s') AS rectime,
    s.ATMID,
    s.Bank
FROM
    port_status_network_report p
JOIN
    sites s ON p.site_id = s.SN AND s.live = 'Y'
WHERE
    (p.site_id, p.rectime) IN (SELECT site_id, MAX(rectime) FROM port_status_network_report GROUP BY site_id)
ORDER BY
    p.site_id ASC

`;
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

app.get('/ExportOnlineSites', (req, res) => {

    // const atmid = req.query.atmid || '';

    let query = `
    SELECT
    dh.atmid,
    dh.ip AS routerip,
    CASE
        WHEN dh.login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status,
    s.city,
    s.state,
    s.zone,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.dvrtype,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,          
    CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
FROM
    dvr_health dh
JOIN
    sites s ON dh.atmid = s.ATMID
WHERE
    dh.login_status = 0
    AND s.live = 'Y'`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});

app.get('/ExportOfflineSites', async (req, res) => {
    const atmid = req.query.atmid || '';

    let query = `
    SELECT
    dh.atmid,
    dh.login_status,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    dh.ip AS routerip,
    CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
    s.city,
    s.state,
    s.zone,
    CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)) AS time_difference_hours_minutes
FROM
    dvr_health dh
JOIN
    sites s ON dh.atmid = s.ATMID
WHERE
    dh.login_status = 1 OR dh.login_status IS NULL
    AND s.live = 'Y'`;

    // if (atmid) {
    //     query += ` AND dh.atmid LIKE '%${atmid}%'`;
    // }

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});


app.get('/TimeDifferenceExport', (req, res) => {

    const query = `
        SELECT
            dvr_health.atmid,         
            DATE_FORMAT(dvr_health.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
            dvr_health.cam1,
            dvr_health.cam2,
            dvr_health.cam3,
            dvr_health.cam4,
            CASE
            WHEN dvr_health.login_status = 0 THEN 'working'
            ELSE 'not working'
        END AS login_status,
            DATE_FORMAT(dvr_health.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
            dvr_health.ip,
            CASE WHEN dvr_health.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
            sites.city,
            sites.state,
            sites.zone,
            CONCAT(FLOOR(TIMESTAMPDIFF(MINUTE, dvr_health.cdate, NOW()) / 60), ':', MOD(TIMESTAMPDIFF(MINUTE, dvr_health.cdate, NOW()), 60)) AS time_difference_hours_minutes
        FROM
            dvr_health
        JOIN
            sites ON dvr_health.atmid = sites.ATMID
        WHERE
        dvr_health.login_status = 0
         AND   sites.live = 'Y'
       
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});


app.get('/RecNotavailableExport', (req, res) => {

    const query = `
    SELECT
    dh.atmid,
    dh.login_status,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    dh.cam1,
    dh.cam2,
    dh.cam3,
    dh.cam4,
    dh.dvrtype,
    DATE_FORMAT(dh.last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(dh.recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(dh.recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(dh.cdate, '%Y-%m-%d %H:%i:%s') AS cdate,
    dh.ip AS routerip,
    CASE WHEN dh.hdd = 'ok' THEN 'working' ELSE 'not working' END AS hdd_status,
    CONCAT(
        FLOOR(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()) / 60),
        ':',
        MOD(TIMESTAMPDIFF(MINUTE, dh.cdate, NOW()), 60)
    ) AS time_difference_hours_minutes
FROM
    dvr_health dh
WHERE
    dh.recording_to <> CURDATE()
    AND dh.live = 'Y'       
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});


app.get('/DeviceHistoryExport', (req, res) => {
    const query = `
    SELECT 
    *,
    CASE 
        WHEN hdd = 'ok' THEN 'working'
        ELSE 'not working'
    END AS hdd_status,
    CASE 
        WHEN login_status = 0 THEN 'working'
        ELSE 'not working'
    END AS login_status, /* Corrected alias name here */
    DATE_FORMAT(last_communication, '%Y-%m-%d %H:%i:%s') AS last_communication,
    DATE_FORMAT(recording_from, '%Y-%m-%d %H:%i:%s') AS recording_from,
    DATE_FORMAT(recording_to, '%Y-%m-%d %H:%i:%s') AS recording_to,
    DATE_FORMAT(cdate, '%Y-%m-%d %H:%i:%s') AS cdate
    FROM 
    dvr_history 
    
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching DVR health data for export:', err);
            res.status(500).json({ error: 'Error fetching DVR health data for export' });
        } else {
            res.status(200).json({ data: result });
        }
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM registered_users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (results.length === 0) {
            console.log('No user found for username:', username);
            res.status(401).json({ error: 'Authentication failed' });
        } else {
            const user = results[0];
            if (!user) {
                console.log('User object is null');
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            const id = user.id;
            console.log('User found with id:', id);
            res.status(200).json({
                message: 'Login successful',
                id,

            });
        }
    });
});

app.get('/ExportPanelHealthDetails', async (req, res) => {
    const apiUrl = 'http://103.141.218.26:8080/Hitachi/api/panel_health_data_report_ajax_api.php';

    try {
        const response = await axios.get(apiUrl);
        const responseData = response.data[0];

        if (responseData && responseData.res_data && Array.isArray(responseData.res_data)) {
            let result = responseData.res_data;

            result.forEach(record => {
                // Parse the 'zone_config' field if it exists
                if (record.zone_config) {
                    try {
                        const parsedZoneConfig = JSON.parse(record.zone_config);
                        record.zone_config = parsedZoneConfig;
                    } catch (e) {
                        console.error('Error parsing zone_config:', e);
                    }
                }
            });

            res.status(200).json({ data: result });
        } else {
            console.error('Error: Response data is not in the expected format.');
            res.status(500).json({ error: 'Error fetching panel health data' });
        }
    } catch (error) {
        console.error('Error fetching panel health data:', error);
        res.status(500).json({ error: 'Error fetching panel health data' });
    }
});


app.get('/verify_id', (req, res) => {
    const query = `
      SELECT id
      FROM registered_users;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user data:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json(results);
        }
    });
});


app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const user = { username, email, password };

    db.query('INSERT INTO registered_users SET ?', user, (err, result) => {
        if (err) {
            console.error('Error registering user:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(201).json({ message: 'User registered successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});