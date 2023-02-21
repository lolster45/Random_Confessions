import {auth, provider} from "../../config/firebase-config"
import { signInWithPopup } from "firebase/auth"


import { useRouter } from "next/router"
import Link from "next/link"

//React-icons...
import {FcGoogle} from "react-icons/fc"


const Login = () => {
    const router = useRouter()

    const signUpWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            router.push("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <section className="login-page">
            <div className="social-cont">
                <Link className="go-back" href="/">Go Back</Link>
                <button onClick={signUpWithGoogle}>
                    <FcGoogle/>
                    Login With Google
                </button>
            </div>
        </section>
    )
}

export default Login