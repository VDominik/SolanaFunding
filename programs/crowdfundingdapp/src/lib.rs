use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;
use anchor_lang::solana_program::pubkey::Pubkey;
use std::str::FromStr;

declare_id!("2BePaJPAPUih3FWZXR9ZfjawxkWnKQtYp2jpQn7Sxk3h");

#[program]
pub mod crowdfundingdapp {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String, description: String, amount_wanted: String, counter: u32) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = name;
        campaign.description = description;
        campaign.amount_wanted = amount_wanted;
        campaign.amount_donated = 0;
        campaign.admin = *ctx.accounts.user.key;
        Ok(())
        
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;
        if campaign.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId);
        }
        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
        if **campaign.to_account_info().lamports.borrow() - rent_balance < amount {
            return Err(ProgramError::InsufficientFunds);
        }
        **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> ProgramResult {
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;
        let developer_fee = amount / 20; // Calculate 5% of the donation
        let net_donation = amount - developer_fee; // Subtract the developer fee from the donation
        campaign.list_of_donors.push(user.key());

        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.campaign.key(),
            net_donation,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.campaign.to_account_info()
            ]
        );

        //My attempt at a solution
        let ixf = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.developer.key(),
            developer_fee,
        );
        anchor_lang::solana_program::program::invoke(
            &ixf,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.developer.to_account_info()
            ]
        );
        
        (&mut ctx.accounts.campaign).amount_donated += net_donation;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, description: String, amount_wanted: String, counter: u32)]
pub struct Create <'info> {
    
    #[account(init, payer = user, space = 9000, seeds = [user.key().as_ref(), &counter.to_le_bytes()], bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub user: Signer<'info>,
    /// The system program provides a way to transfer SOL from one account to another.
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: The developer field is marked as unsafe because...
    #[account(mut, constraint = developer.key() == Pubkey::from_str("AZh3i2QBZkpe8HdgoW3uWabwWAZqeVgfpkEVD9ja7GN").unwrap())]
    pub developer: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub amount_wanted: String,
    pub amount_donated: u64,
    pub counter: u32,
    pub list_of_donors: Vec<Pubkey>,
}
