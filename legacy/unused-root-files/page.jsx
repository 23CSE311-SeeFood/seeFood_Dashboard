import { redirect } from 'next/navigation';

// Home component - Redirects the user to the staff login page
export default function Home() {
    redirect('/staff/login');
}
