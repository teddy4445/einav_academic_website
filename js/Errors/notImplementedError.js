class NotImplemented extends Error
{
	constructor(message = "", ...args) 
	{
		super(message, ...args);
		this.message = message + " has not yet been implemented.";
		this.name = 'NotImplementedError';
	}
}