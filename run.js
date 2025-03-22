 let searchCount = 0;
        let maxSearches = 99; // Default to Free Plan

        // Functionality to show DNS Checker
        function showDnsChecker() {
            document.getElementById('landing-page').style.display = 'none';
            document.getElementById('dns-checker-container').style.display = 'block';
            document.getElementById('payment-section').style.display = 'block';
        }

        // Functionality for subscription
        function updatePaymentDetails() {
            const selectedPackage = document.getElementById('payment-package').value;
            if (selectedPackage === 'free') {
                maxSearches = 5;
            } else if (selectedPackage === 'basic') {
                maxSearches = 20;
            } else if (selectedPackage === 'premium') {
                maxSearches = Infinity;
            }
        }

        function initiatePayment() {
            const amount = (document.getElementById('payment-package').value === 'basic') ? 500 : 1500;
            fetch('/create-payment-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, description: 'DNS Subscription' }),
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = data.paymentLink;
            })
            .catch(error => console.error('Error initiating payment:', error));
        }

        // Functionality to check DNS records
        document.getElementById('check-btn').addEventListener('click', () => {
            const domain = document.getElementById('domain').value.trim();
            const recordType = document.getElementById('record-type').value;
            const dnsProvider = document.getElementById('dns-provider').value;

            if (!domain) {
                alert('Please enter a valid domain.');
                return;
            }

            if (searchCount >= maxSearches && maxSearches !== Infinity) {
                alert('You have reached your search limit. Please upgrade your package.');
                return;
            }

            searchCount++;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('result').style.display = 'none';

            let apiUrl = '';
            if (dnsProvider === 'google') {
                apiUrl = `https://dns.google/resolve?name=${domain}&type=${recordType}`;
            } else if (dnsProvider === 'cloudflare') {
                apiUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=${recordType}`;
            }

            fetch(apiUrl, { headers: { 'Accept': 'application/dns-json' } })
                .then(response => response.json())
                .then(data => {
                    document.getElementById('loading').style.display = 'none';
                    const result = data.Answer ? data.Answer.map(record => record.data).join('\n') : 'No DNS records found.';
                    document.getElementById('dns-result').textContent = result;
                    document.getElementById('result').style.display = 'block';
                })
                .catch(() => {
                    document.getElementById('loading').style.display = 'none';
                    alert('Error fetching DNS records.');
                });
        });
