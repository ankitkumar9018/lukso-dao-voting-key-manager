import "./Proposal.css"
import {BigNumber, ethers} from "ethers";
import {Button, ProgressBar} from "react-bootstrap";
import {displayShortAddress} from "./ResponsiveUtils";
import "./TransferProposal.css"
import {toast} from "react-toastify";
import EndingIn from "./EndingIn";
import {useState} from "react";
import moment from "moment";

export default function TransferProposal({proposal, governanceTokenSymbol, contract, proposalTimeToVote, voteSent}) {

    const votingEnd = moment.unix(proposal.createdAt).add(proposalTimeToVote, 'seconds')

    const calculateCanVote = () => {
        return !votingEnd.isBefore(moment())
    }

    const [canVote, setCanVote] = useState(calculateCanVote())

    const getYesToNoVotes = () => {
        const sumVotes = proposal.yesVotes.add(proposal.noVotes)
        if(sumVotes.gt(0)) {
            return (proposal.yesVotes.mul(100)).div(sumVotes)
        } else {
            return 0
        }
    }

    const getNoToYesVotes = () => {
        if(proposal.noVotes.gt(0)) {
            return BigNumber.from(100).sub(getYesToNoVotes())
        } else {
            return 0
        }
    }

    const voteYes = () => {
        const voteYesPromise = contract.vote(proposal.id, true)
            .then(_ => {
                voteSent()
            })
            .catch(e => {
                console.error(e)
                throw e
            })

        toast.promise(voteYesPromise, {
            pending: 'Voting Yes',
            success: '🦀 Voted Yes 🦀',
            error: '☠ Vote Yes failure ☠'
        })
    }

    const voteNo = () => {
        const voteYesPromise = contract.vote(proposal.id, false)
            .then(_ => {
                voteSent()
            })
            .catch(e => {
                console.error(e)
                throw e
            })

        toast.promise(voteYesPromise, {
            pending: 'Voting No',
            success: '🦀 Voted No 🦀',
            error: '☠ Vote No failure ☠'
        })
    }

    const link = (to) => <a className={"linkToExplorer"} target="_blank"
                            href={"https://explorer.execution.l16.lukso.network/address/" + to}>{displayShortAddress(to)}</a>

    const voteYesButton = <Button variant="outline-dark" size="sm" onClick={voteYes} disabled={!canVote}>
        Vote Yes
    </Button>

    const voteNoButton = <Button variant="outline-dark" size="sm" onClick={voteNo} disabled={!canVote}>
        Vote No
    </Button>


    const voteProgress = () => <div>
        <ProgressBar animated className={"votesProgressBar"}>
            <ProgressBar animated striped variant="success" now={getYesToNoVotes()} key={1} label={ethers.utils.formatEther(proposal.yesVotes) + " $" + governanceTokenSymbol}/>
            <ProgressBar animated striped variant="danger" now={getNoToYesVotes()} key={2} label={ethers.utils.formatEther(proposal.noVotes) + " $" + governanceTokenSymbol}/>
        </ProgressBar>
    </div>

    return <tr className={"tableRowCenter"}>
        <td className="align-middle">{proposal.id.toNumber()}</td>
        <td className="align-middle"><EndingIn votingEnd={votingEnd} updateCantVote={() => setCanVote(false)}/></td>
        <td className="align-middle">Transfer {ethers.utils.formatEther(proposal.value)} $LXYt
            to {link(proposal.to)}</td>
        <td className="align-middle">{link(proposal.createdBy)}</td>
        <td className="align-middle">{voteProgress()}</td>
        <td className="align-middle">{voteYesButton} {voteNoButton}</td>
    </tr>
}