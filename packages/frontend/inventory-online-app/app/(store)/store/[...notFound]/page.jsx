import { notFound } from 'next/navigation'

// Next.js's automatic "this URL doesn't match anything" fallback only
// renders the ROOT app/not-found.jsx — a nested not-found.jsx (like
// app/(store)/store/not-found.jsx) only kicks in when a route actually
// matched structurally and something inside it calls notFound() explicitly
// (e.g. a [id]/page.jsx that looked up a record and didn't find it).
// A path like /store/products/hola doesn't match any real route at all —
// there's no dynamic segment there to catch it — so Next.js has nothing to
// hang the nested 404 off of and falls all the way back to the bare root
// page. This catch-all fixes that: [...notFound] matches ANY otherwise
// unmatched path under /store/*, and immediately calls notFound() itself,
// which then renders the nearest not-found.jsx up the tree — the one in
// app/(store)/store/, wrapped in the dashboard's <Panel/>.
export default function StoreCatchAll() {
    notFound()
}
