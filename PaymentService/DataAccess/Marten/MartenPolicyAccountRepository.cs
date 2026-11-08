using System.Linq;
using System.Threading.Tasks;
using Marten;
using PaymentService.Domain;
using PaymentService.Init;

namespace PaymentService.DataAccess.Marten;

public class MartenPolicyAccountRepository : IPolicyAccountRepository
{
    private readonly IDocumentSession documentSession;

    public MartenPolicyAccountRepository(IDocumentSession documentSession)
    {
        this.documentSession = documentSession;
    }

    public void Add(PolicyAccount policyAccount)
    {
        documentSession.Insert(policyAccount);
    }

    public void Update(PolicyAccount policyAccount)
    {
        documentSession.Update(policyAccount);
    }

    public async Task<PolicyAccount> FindByNumber(string policyNumber)
    {
        try
        {
            return await documentSession
                .Query<PolicyAccount>()
                .FirstOrDefaultAsync(p => p.PolicyNumber == policyNumber);
        }
        catch
        {
            return DemoAccountsFactory.DemoAccounts().FirstOrDefault(p => p.PolicyNumber == policyNumber);
        }
    }

    public async Task<bool> ExistsWithPolicyNumber(string policyNumber)
    {
        try
        {
            return await documentSession
                .Query<PolicyAccount>()
                .AnyAsync(p => p.PolicyNumber == policyNumber);
        }
        catch
        {
            return DemoAccountsFactory.DemoAccounts().Any(p => p.PolicyNumber == policyNumber);
        }
    }
}