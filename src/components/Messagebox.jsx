import successImg from "../assets/icons8-success.gif"
import errorImg from "../assets/icons8-error-48.png"
import loadingImg from "../assets/icons8-loading.gif"

function MessageBox({ success, error, loading, message, dismissable = false, setShowMessage }) {
    return (
        <div style={{ 
            position: 'fixed',
            display: 'flex',
            justifyContent: 'space-around',
            top: 0,
            left: 0,
            minHeight: '100vh',
            width: '100%',
            backgroundColor: 'rgba(192, 192, 192, 0.9)',
            zIndex: 10,
        }}>
            <div style={{ 
                borderRadius: '0.5rem',
                padding: '1.25rem',
                textAlign: 'center',
                margin: 'auto',
                minHeight: '30%',
                minWidth: '20%',
                maxWidth: 'fit-content',
                backgroundColor: '#ffffff',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    {success ? <img src={successImg} alt="Success" /> : null}
                    {error ? <img src={errorImg} alt="Error" /> : null}
                    {loading ? <img src={loadingImg} alt="Loading" /> : null}
                </div>
                <div style={{ marginTop: '1rem' }}>
                    {message}
                </div>
                {dismissable ?
                    <button onClick={() => setShowMessage(false)} style={{ 
                        padding: '0.625rem 1.25rem',
                        marginBottom: '0.9375rem',
                        fontWeight: '500',
                        border: '2px solid',
                        borderRadius: '0.375rem',
                        backgroundColor: '#4F46E5',
                        color: '#ffffff',
                        cursor: 'pointer',
                    }}>Close</button>
                    : null}
            </div>
        </div>
    )
}

export default MessageBox;
