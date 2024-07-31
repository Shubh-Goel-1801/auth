var express = require('express');
var router = express.Router();
const db = require('../connection');
const isAuthenticated = require('../middlewares/isAuthentication');
router.use(isAuthenticated);

router.get('/', (req, res) => {
    const userId = req.user.id; 
    const sql = 'SELECT * FROM user_addresses WHERE user_id = ?';
    
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error fetching addresses:', err);
            return res.status(500).send('Error fetching addresses');
        }
        res.render('addressList', {
            addresses: results, 
            messages: req.flash('info')
        });
    });
});

router.get('/add', (req, res) => {
    res.render('addAddress', { messages: req.flash('info') });
});

router.post('/add', (req, res) => {
    const { country, state, city } = req.body;
    const userId = req.user.id; 
    const sql = 'INSERT INTO user_addresses (user_id, country, state, city) VALUES (?, ?, ?, ?)';

    db.query(sql, [userId, country, state, city], (err) => {
        if (err) {
            console.log('Error adding address:', err);
            return res.status(500).send('Error adding address');
        }
        req.flash('info', 'Address added successfully!');
        res.redirect('/addresses');
    });
});

router.post('/update/:id', (req, res) => {
    const { country, state, city } = req.body;
    const addressId = req.params.id;
    const sql = 'UPDATE user_addresses SET country = ?, state = ?, city = ? WHERE id = ?';

    db.query(sql, [country, state, city, addressId], (err) => {
        if (err) {
            console.log('Error updating address:', err); 
            req.flash('info', 'Error updating address');
            return res.redirect('/addresses');
        }
        req.flash('info', 'Address updated successfully!');
        res.redirect('/addresses');
    });
});


router.post('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM user_addresses WHERE id = ?';

    db.query(sql, [id], (err) => {
        if (err) {
            console.log('Error deleting address:', err);
            return res.status(500).send('Error deleting address');
        }
        req.flash('info', 'Address deleted successfully!');
        res.redirect('/addresses');
    });
});

module.exports = router;
